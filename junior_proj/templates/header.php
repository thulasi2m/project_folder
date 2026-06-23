<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IQ Quiz</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        .quiz-option:hover {
            background-color: #f0fdf4;
            transform: translateY(-2px);
        }
        .correct-answer {
            background-color: #dcfce7;
            border-left: 4px solid #22c55e;
        }
        .wrong-answer {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <nav class="bg-green-600 text-white shadow-lg">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <a href="?action=quiz" class="text-xl font-bold flex items-center">
                <i class="fas fa-brain mr-2"></i> IQ Quiz
            </a>
            <div>
                <?php if (isset($_SESSION['username'])): ?>
                    <span class="mr-4">Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></span>
                    <a href="?action=logout" class="bg-white text-green-600 px-4 py-1 rounded hover:bg-gray-100 transition">
                        Logout
                    </a>
                <?php else: ?>
                    <a href="?action=login" class="bg-white text-green-600 px-4 py-1 rounded hover:bg-gray-100 transition">
                        Login
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </nav>
    <main class="container mx-auto px-4 py-8">