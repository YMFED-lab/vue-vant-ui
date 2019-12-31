function initRem () {
  let cale = window.screen.availWidth > 750 ? 2 : window.screen.availWidth / 375
  window.document.documentElement.style.fontSize = `${100 * cale}px`
}

window.addEventListener('resize', function () {
  initRem()
  if (
    document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA'
  ) {
    window.setTimeout(function () {
      if ('scrollIntoView' in document.activeElement) {
        document.activeElement.scrollIntoView(false)
      } else {
        document.activeElement.scrollIntoViewIfNeeded(false)
      }
    }, 0)
  }
})

document.addEventListener('focusout', () => {
  setTimeout(() => {
    let height = document.documentElement.scrollTop || document.body.scrollTop
    window.scrollTo(0, height + 1)
  }, 20)
})
