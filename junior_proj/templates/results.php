<div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
    <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Quiz Results</h2>
        <p class="text-gray-600"><?php echo htmlspecialchars($feedback); ?></p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-green-50 p-4 rounded-lg text-center">
            <p class="text-sm text-green-600 font-medium">Score</p>
            <p class="text-3xl font-bold text-green-700"><?php echo $score; ?>/<?php echo $total; ?></p>
        </div>
        
        <div class="bg-blue-50 p-4 rounded-lg text-center">
            <p class="text-sm text-blue-600 font-medium">Percentage</p>
            <p class="text-3xl font-bold text-blue-700"><?php echo $percentage; ?>%</p>
        </div>
        
        <div class="bg-purple-50 p-4 rounded-lg text-center">
            <p class="text-sm text-purple-600 font-medium">Time Taken</p>
            <p class="text-3xl font-bold text-purple-700"><?php echo $time_taken; ?>s</p>
        </div>
    </div>
    
    <h3 class="text-xl font-semibold text-gray-800 mb-4">Question Review</h3>
    
    <div class="space-y-6">
        <?php foreach ($review as $index => $item): ?>
            <div class="p-4 rounded-lg <?php echo $item['is_correct'] ? 'correct-answer' : 'wrong-answer'; ?>">
                <p class="font-medium text-gray-800 mb-2"><?php echo ($index + 1) . '. ' . htmlspecialchars($item['question']); ?></p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Your Answer:</p>
                        <p class="<?php echo $item['is_correct'] ? 'text-green-600' : 'text-red-600'; ?> font-medium">
                            <?php echo htmlspecialchars($item['user_answer'] ?? 'Not answered'); ?>
                            <?php if ($item['is_correct']): ?>
                                <i class="fas fa-check ml-1"></i>
                            <?php else: ?>
                                <i class="fas fa-times ml-1"></i>
                            <?php endif; ?>
                        </p>
                    </div>
                    
                    <?php if (!$item['is_correct']): ?>
                        <div>
                            <p class="text-sm text-gray-500">Correct Answer:</p>
                            <p class="text-green-600 font-medium"><?php echo htmlspecialchars($item['correct_answer']); ?></p>
                        </div>
                    <?php endif; ?>
                </div>
                
                <?php if (!$item['is_correct']): ?>
                    <div class="mt-3">
                        <p class="text-sm text-gray-500">Options:</p>
                        <div class="flex flex-wrap gap-2 mt-1">
                            <?php foreach ($item['options'] as $option): ?>
                                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    <?php echo htmlspecialchars($option); ?>
                                </span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
    
    <div class="mt-8 text-center">
        <a href="?action=quiz" class="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
            Try Again
        </a>
    </div>
</div>