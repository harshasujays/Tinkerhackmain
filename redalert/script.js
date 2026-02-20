// Minimal JS for RedAlert
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('assessmentForm');
  const startBtn = document.getElementById('startBtn');
  const darkToggle = document.getElementById('darkToggle');

  // Submit handler: just show alert
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      alert('Assessment submitted successfully');
      form.reset();
      // Optionally, scroll to top of form
      document.getElementById('questionnaire').scrollIntoView({behavior:'smooth'});
    });
  }

  // Smooth scroll for Start button (anchor already works, this ensures consistent behavior)
  if(startBtn){
    startBtn.addEventListener('click', function(e){
      // allow default anchor behavior but ensure smooth scroll
      const target = document.getElementById('questionnaire');
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
      }
    });
  }

  // Dark mode toggle (simple, stores preference)
  function applyTheme(dark){
    if(dark){
      document.body.classList.add('dark');
      darkToggle.setAttribute('aria-pressed','true');
    } else {
      document.body.classList.remove('dark');
      darkToggle.setAttribute('aria-pressed','false');
    }
  }

  // initialize from localStorage
  const stored = localStorage.getItem('redalert-dark');
  applyTheme(stored === 'true');

  if(darkToggle){
    darkToggle.addEventListener('click', function(){
      const isDark = document.body.classList.toggle('dark');
      darkToggle.setAttribute('aria-pressed', String(isDark));
      localStorage.setItem('redalert-dark', String(isDark));
    });
  }
});
