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

// Fetch performance data
function getPerformanceData() {
    global $conn;
    
    $result = $conn->query("SELECT username, score FROM performance ORDER BY submitted_at DESC LIMIT 10");
    
    $usernames = [];
    $scores = [];
    
    while ($row = $result->fetch_assoc()) {
        $usernames[] = $row['username'];
        $scores[] = $row['score'];
    }
    
    return [
        'usernames' => $usernames,
        'scores' => $scores
    ];
}

// Fetch the data for the graph
$performanceData = getPerformanceData();
$usernames = json_encode($performanceData['usernames']);
$scores = json_encode($performanceData['scores']);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Performance Analytics - User Scores</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 p-8">

<div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">User Score Analytics</h2>
    
    <canvas id="scoreChart" width="400" height="200"></canvas>
    
    <script>
        var ctx = document.getElementById('scoreChart').getContext('2d');
        var scoreChart = new Chart(ctx, {
            type: 'bar', // Use 'bar' for bar chart representation
            data: {
                labels: <?php echo $usernames; ?>,
                datasets: [{
                    label: 'Score',
                    data: <?php echo $scores; ?>,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Usernames'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Score'
                        }
                    }
                }
            }
        });
    </script>
</div>

</body>
</html>
