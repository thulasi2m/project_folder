<?php
session_start();

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'task1');

// Create database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create tables if they don't exist
$sql = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    answer VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    time_taken FLOAT NOT NULL,
    submitted_at DATETIME NOT NULL
);
";

// Execute multi-query
if (!$conn->multi_query($sql)) {
    die("Error creating tables: " . $conn->error);
}

// Clear multi-query results
while ($conn->more_results()) {
    $conn->next_result();
}

// Insert sample questions if none exist
$checkQuestions = $conn->query("SELECT COUNT(*) as count FROM questions");
$row = $checkQuestions->fetch_assoc();
if ($row['count'] == 0) {
    $sampleQuestions = [
        [
            'topic' => 'Logic',
            'question' => 'Which number comes next: 2, 4, 8, 16, ?',
            'options' => json_encode(['18', '24', '32', '34']),
            'answer' => '32'
        ],
        [
            'topic' => 'Logic',
            'question' => 'What is the odd one out? Apple, Banana, Carrot, Grape',
            'options' => json_encode(['Apple', 'Banana', 'Carrot', 'Grape']),
            'answer' => 'Carrot'
        ],
        [
            'topic' => 'Math',
            'question' => 'What is 15 + 6?',
            'options' => json_encode(['21', '20', '22', '23']),
            'answer' => '21'
        ],
        [
            'topic' => 'Math',
            'question' => 'Solve: 8 × 7',
            'options' => json_encode(['54', '56', '58', '60']),
            'answer' => '56'
        ]
    ];
    
    $stmt = $conn->prepare("INSERT INTO questions (topic, question, options, answer) VALUES (?, ?, ?, ?)");
    foreach ($sampleQuestions as $question) {
        $stmt->bind_param("ssss", $question['topic'], $question['question'], $question['options'], $question['answer']);
        $stmt->execute();
    }
    $stmt->close();
}

// Handle routing
$action = isset($_GET['action']) ? $_GET['action'] : 'login';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'register':
        handleRegister();
        break;
    case 'quiz':
        handleQuiz();
        break;
    case 'submit':
        handleSubmit();
        break;
    case 'results':
        showResults();
        break;
    case 'logout':
        session_destroy();
        header("Location: ?action=login");
        exit;
    case 'forgot_password':
        handleForgotPassword();
        break;
    case 'forgot_password_request':
        handleForgotPasswordRequest();
        break;
    case 'reset_password':
        handleResetPassword();
        break;
    case 'forgot_password_reset':
        handleForgotPasswordReset();
        break;
    case 'forgot_password_clear':
        unset($_SESSION['reset_phone']);
        header("Location: ?action=forgot_password");
        exit;
    default:
        handleLogin();
}

function handleLogin() {
    global $conn;
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = trim($_POST['username']);
        $password = $_POST['password'];
        
        $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                header("Location: ?action=quiz");
                exit;
            } else {
                $_SESSION['error'] = "Invalid password. Please recover your account.";
                header("Location: ?action=forgot_password");
                exit;
            }
        } else {
            $error = "Username not found";
        }
    }
    
    renderTemplate('login', ['error' => $error ?? null]);
}

function handleForgotPassword() {
    renderTemplate('forgot_password', [
        'error' => $_SESSION['error'] ?? null
    ]);
    unset($_SESSION['error']);
}

function handleResetPassword() {
    if (!isset($_SESSION['reset_phone'])) {
        header("Location: ?action=forgot_password");
        exit;
    }
    renderTemplate('reset_password', [
        'error' => $_SESSION['error'] ?? null,
        'success' => $_SESSION['success'] ?? null
    ]);
    unset($_SESSION['error']);
    unset($_SESSION['success']);
}

function handleForgotPasswordRequest() {
    global $conn;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $phone = trim($_POST['phone']);
        
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $phone);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $_SESSION['reset_phone'] = $phone;
            header("Location: ?action=reset_password");
            exit;
        } else {
            $_SESSION['error'] = "Phone number not found in our records.";
            header("Location: ?action=forgot_password");
            exit;
        }
}

function handleForgotPasswordReset() {
    global $conn;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = trim($_POST['username']);
        $new_password = $_POST['new_password'];
        $confirm_password = $_POST['confirm_password'];
        
        if ($new_password !== $confirm_password) {
            $_SESSION['error'] = "Passwords do not match.";
            header("Location: ?action=forgot_password");
            exit;
        }
        
        // Verify user exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            $update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
            $update_stmt->bind_param("ss", $hashed_password, $username);
            if ($update_stmt->execute()) {
                // Return to original login screen upon successful password confirmation
                header("Location: ?action=login");
                exit;
            } else {
                $_SESSION['error'] = "Failed to reset password. Try again.";
            }
        } else {
            $_SESSION['error'] = "Username/Phone number not found in our records.";
        }
    }
    header("Location: ?action=forgot_password");
    exit;
}

function handleRegister() {
    global $conn;
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = trim($_POST['username']);
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];
        
        // Validate input
        if (empty($username) || empty($password)) {
            $error = "Username and password are required";
        } elseif ($password !== $confirm_password) {
            $error = "Passwords do not match";
        } else {
            // Check if username exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $error = "Username already taken";
            } else {
                // Create new user
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
                $stmt->bind_param("ss", $username, $hashed_password);
                
                if ($stmt->execute()) {
                    $_SESSION['user_id'] = $stmt->insert_id;
                    $_SESSION['username'] = $username;
                    header("Location: ?action=quiz");
                    exit;
                } else {
                    $error = "Registration failed. Please try again.";
                }
            }
        }
    }
    
    renderTemplate('register', ['error' => $error ?? null]);
}

function handleQuiz() {
    global $conn;
    
    if (!isset($_SESSION['user_id'])) {
        header("Location: ?action=login");
        exit;
    }
    
    // Get questions from database
    $result = $conn->query("SELECT * FROM questions");
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[$row['topic']][] = [
            'id' => $row['id'],
            'question' => $row['question'],
            'options' => json_decode($row['options'], true),
            'answer' => $row['answer']
        ];
    }
    
    $_SESSION['start_time'] = microtime(true);
    
    renderTemplate('quiz', [
        'username' => $_SESSION['username'],
        'questions' => $questions
    ]);
}

function handleSubmit() {
    global $conn;
    
    if (!isset($_SESSION['user_id'])) {
        header("Location: ?action=login");
        exit;
    }
    
    $end_time = microtime(true);
    $start_time = $_SESSION['start_time'] ?? $end_time;
    $time_taken = $end_time - $start_time;
    
    $score = 0;
    $total_questions = 0;
    $review_data = [];
    
    // Get all questions to check answers
    $result = $conn->query("SELECT * FROM questions");
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[$row['id']] = $row;
    }
    
    foreach ($_POST as $key => $user_answer) {
        if (strpos($key, 'q_') === 0) {
            $question_id = substr($key, 2);
            $total_questions++;
            
            if (isset($questions[$question_id])) {
                $question = $questions[$question_id];
                $correct = ($user_answer === $question['answer']);
                
                if ($correct) {
                    $score++;
                }
                
                $review_data[] = [
                    'question' => $question['question'],
                    'options' => json_decode($question['options'], true),
                    'user_answer' => $user_answer,
                    'correct_answer' => $question['answer'],
                    'is_correct' => $correct
                ];
            }
        }
    }
    
    // Save performance to database
    $stmt = $conn->prepare("INSERT INTO performance (username, score, total_questions, time_taken, submitted_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("siid", $_SESSION['username'], $score, $total_questions, $time_taken);
    $stmt->execute();
    
    $_SESSION['results'] = [
        'score' => $score,
        'total' => $total_questions,
        'time_taken' => round($time_taken, 2),
        'review' => $review_data
    ];
    
    header("Location: ?action=results");
    exit;
}

function showResults() {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['results'])) {
        header("Location: ?action=login");
        exit;
    }
    
    $results = $_SESSION['results'];
    $percentage = round(($results['score'] / $results['total']) * 100, 2);
    
    if ($percentage >= 80) {
        $feedback = "Excellent work!";
    } elseif ($percentage >= 60) {
        $feedback = "Good job!";
    } elseif ($percentage >= 40) {
        $feedback = "Fair attempt.";
    } else {
        $feedback = "Needs improvement.";
    }
    
    renderTemplate('results', [
        'username' => $_SESSION['username'],
        'score' => $results['score'],
        'total' => $results['total'],
        'percentage' => $percentage,
        'time_taken' => $results['time_taken'],
        'feedback' => $feedback,
        'review' => $results['review']
    ]);
}

function renderTemplate($template, $data = []) {
    extract($data);
    include "templates/header.php";
    include "templates/{$template}.php";
    include "templates/footer.php";
}

// Create templates directory if it doesn't exist
if (!is_dir('templates')) {
    mkdir('templates');
}


?>