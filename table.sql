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
    total_questions INT NOT NULL,  -- This was missing
    time_taken FLOAT NOT NULL,
    submitted_at DATETIME NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
);