/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if (navToggle) {
   navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu')
   })
}

/*=============== REMOVE MENU MOBILE ===============*/
if (navClose) {
   navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu')
   })
}

document.querySelectorAll('.nav__link').forEach(link => {
   link.addEventListener('click', () => {
      navMenu.classList.remove('show-menu')
   })
})

/*=============== GSAP ANIMATION ===============*/
if (window.gsap) {
   gsap.from('.home__icon', { opacity: 0, y: -20, duration: .8, ease: 'power2.out' })
   gsap.from('.home__title', { opacity: 0, y: 24, duration: .9, delay: .15, ease: 'power2.out' })
   gsap.from('.home__description', { opacity: 0, y: 20, duration: .9, delay: .3, ease: 'power2.out' })
   gsap.from('.home__buttons', { opacity: 0, y: 20, duration: .9, delay: .45, ease: 'power2.out' })
}
