function showSection(section) {
  const sections = document.querySelectorAll('.collection-section');
  sections.forEach(s => s.style.display = 'none');
  const target = document.getElementById(section);
  if (target) target.style.display = 'block';
}

(function(){
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = modal ? modal.querySelector('.close-modal') : null;
  let lastTrigger = null;

  function openFrom(selector, trigger){
    const src = document.querySelector(selector);
    if (!src || !modal || !modalBody) { return; }
    modalBody.innerHTML = src.innerHTML;
    modal.style.display = 'block';
    lastTrigger = trigger || null;
    if (closeBtn) closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    if (!modal || !modalBody) return;
    modal.style.display = 'none';
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  document.addEventListener('click', (e)=>{
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger){
      e.preventDefault();
      openFrom(trigger.getAttribute('data-modal-target'), trigger);
      return;
    }
    if (modal && (e.target === modal || e.target.closest('.close-modal'))) closeModal();
  });

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && modal && modal.style.display === 'block') closeModal();
  });
})();
