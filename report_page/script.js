document.addEventListener('DOMContentLoaded',()=>{
  const analyzeBtn = document.getElementById('analyzeBtn');
  analyzeBtn.addEventListener('click',()=>{
    const empty = document.querySelector('.empty-state');
    empty.querySelector('h3').textContent = 'No data available';
    // In a real app you'd fetch filtered data and render the table here.
    empty.classList.add('flash');
    setTimeout(()=>empty.classList.remove('flash'),350);
  });

  // simple keyboard accessibility for demo
  document.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('keyup',(e)=>{ if(e.key === 'Enter') b.click(); });
  });
});
