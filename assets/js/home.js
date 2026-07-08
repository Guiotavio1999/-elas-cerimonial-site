document.addEventListener('DOMContentLoaded', function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  var prologue = document.getElementById('prologue');
  var header = document.getElementById('site-header');

  function endPrologue(){
    if (hasGSAP){
      gsap.to(prologue, {autoAlpha:0, duration:.6, onComplete:function(){ prologue.style.display='none'; }});
    } else {
      prologue.style.transition = 'opacity .6s ease';
      prologue.style.opacity = 0;
      setTimeout(function(){ prologue.style.display='none'; }, 600);
    }
    header.style.opacity = 1;
    header.style.transform = 'translateY(0)';
  }

  var skip = document.getElementById('skip-intro');
  if (skip) skip.addEventListener('click', endPrologue);

  if (prologue) {
    if (reduced) {
      endPrologue();
    } else if (hasGSAP) {
      var tl = gsap.timeline({ onComplete: endPrologue });
      tl.to('#line1', {autoAlpha:1, duration:1.1})
        .to('#line1', {autoAlpha:0, duration:.9, delay:1.4})
        .to('#line2', {autoAlpha:1, duration:1.1})
        .to('#line2', {autoAlpha:0, duration:.9, delay:1.4})
        .to('.reveal-bg', {autoAlpha:1, filter:'blur(0px) brightness(.75)', scale:1, duration:1.8}, '-=.3')
        .to('#logo-reveal', {autoAlpha:1, duration:1.2}, '-=.6');
    } else {
      setTimeout(endPrologue, 3500);
    }
  }

  // Hero title word reveal
  var heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    var words = heroTitle.textContent.trim().split(' ');
    heroTitle.innerHTML = words.map(function(w){return '<span class="word">'+w+'&nbsp;</span>';}).join('');
    if (hasGSAP) {
      gsap.to('#hero-title .word', {opacity:1, y:0, duration:.9, stagger:.05, delay:reduced?0:5.6, ease:'power2.out'});
    } else {
      setTimeout(function(){
        document.querySelectorAll('#hero-title .word').forEach(function(w){ w.style.opacity=1; w.style.transform='none'; w.style.transition='opacity .5s, transform .5s'; });
      }, reduced?0:3600);
    }
  }

  // Chapter rail scroll spy + click
  var dotRows = document.querySelectorAll('#chapter-rail .dot-row');
  if (dotRows.length) {
    var sections = Array.from(dotRows).map(function(d){ return document.getElementById(d.dataset.target); });
    dotRows.forEach(function(row){
      row.addEventListener('click', function(){
        document.getElementById(row.dataset.target).scrollIntoView({behavior:'smooth'});
      });
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var idx = sections.indexOf(entry.target);
        if (entry.isIntersecting && idx > -1){
          dotRows.forEach(function(d){d.classList.remove('active');});
          dotRows[idx].classList.add('active');
        }
      });
    }, {threshold:.5});
    sections.forEach(function(s){ if(s) io.observe(s); });
  }
});
