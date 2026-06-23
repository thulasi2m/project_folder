<div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Welcome, <?php echo htmlspecialchars($username); ?>!</h2>
    <p class="text-gray-600 mb-6">Test your knowledge with our IQ quiz. Read each question carefully and select the best answer.</p>
    
    <form method="POST" action="?action=submit" class="space-y-8">
        <?php foreach ($questions as $topic => $question_list): ?>
            <div class="border-b border-gray-200 pb-6">
                <h3 class="text-xl font-semibold text-green-700 mb-4"><?php echo htmlspecialchars($topic); ?></h3>
                
                <?php foreach ($question_list as $index => $question): ?>
                    <div class="mb-6 p-4 border border-gray-200 rounded-lg">
                        <p class="font-medium text-gray-800 mb-3"><?php echo ($index + 1) . '. ' . htmlspecialchars($question['question']); ?></p>
                        
                        <div class="space-y-2">
                            <?php foreach ($question['options'] as $option): ?>
                                <label class="flex items-center space-x-3 p-3 rounded-md quiz-option cursor-pointer">
                                    <input type="radio" name="q_<?php echo $question['id']; ?>" value="<?php echo htmlspecialchars($option); ?>" required
                                           class="h-4 w-4 text-green-600 focus:ring-green-500">
                                    <span class="text-gray-700"><?php echo htmlspecialchars($option); ?></span>
                                </label>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endforeach; ?>
        
        <div class="text-center">
            <button type="submit" class="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition font-medium">
                Submit Quiz
            </button>
        </div>
    </form>
</div>