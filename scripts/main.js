let size = false,
  timer = null,
  startTime = 0,
  isRunning = true
const delay =
    (fn, t = 300, e = false, id = 0) =>
    (...a) => (
      id && clearTimeout(id), e && fn.apply(this, a), (id = setTimeout(() => (!e && fn.apply(this, a), (id = null)), t))
    ),
  get = (s, n, c = document.body) => (n ? c.querySelector(s) : c.querySelectorAll(s)),
  // Список участников
  getGap = (gaps, gap = {}) =>
    (gap = gaps.media.find(({ query }) => window.matchMedia(query).matches)) ? gap.value : gaps.default,
  // Отображение видимых элементов
  getVisibleElements = (containerW, itemW, gap) => Math.floor(Math.max((containerW + gap) / (itemW + gap), 1) + 0.02),
  // InitialOffset
  getOffset = (itemW, gap, vio) => -((itemW + gap) * Math.max(...vio)),
  // Static configs
  cfg = {
    animatedAttr: "animated",
    instantAttr: "instant-transform",
    tournamentMembersAutoplay: true,
    tournamentMembersCount: 6,
    tournamentMembersGaps: { default: 20, media: [{ query: "(max-width: 375px)", value: 32 }] },
    tournamentMembersInstantCssVar: "--offset",
    tournamentMembersVIO: [1, 2, 3],
    stagesCurrAttr: "data-current",
    stagesInstantCssVar: "--translate-x",
    stagesSlides: 5,
  },
  // Элементы
  el = {
    animated: get(`[${cfg.animatedAttr}]`, 0),
    tournamentMembersContainer: get(".tournamentMembers__container", 1),
    tournamentMembersList: get(".tournamentMembers__list", 1),
    tournamentMembersListItems: get(".tournamentMembers__list-item", 0),
    tournamentMembersControls: get(".tournamentMembers__controls", 1),
    tournamentMembersVIC: get(".tournamentMembers__controls-counter_vic", 1),
    tournamentMembersPrevBtn: get(".tournamentMembers__controls-btn_prev", 1),
    tournamentMembersNextBtn: get(".tournamentMembers__controls-btn_next", 1),
    tournamentMembersTimer: get(".timer", 1),
    stagesContainer: get(".stages__list-container", 1),
    stagesList: get(".stages__list", 1),
    stagesDots: get(".stages__carousel-dot", 0),
    stagesPrevBtn: get(".stages__carousel-btn_prev", 1),
    stagesNextBtn: get(".stages__carousel-btn_next", 1),
  },
  /**
   * Get initial elements info: widths, offset, gap, visible items, total slides
   * @return {{sContainerW: number, sOffset:number, mItemW:number, mGap:number, mVICV:number, mTotalSlides:number, mInitOffset:number}}
   */
  getInfo = (el, cfg) => {
    return {
      sContainerW: el.stagesContainer.clientWidth,
      sOffset: window.matchMedia("(max-width: 849px)").matches
        ? stagesState.currentIndex * (el.stagesContainer.clientWidth + 20) * -1
        : 0,
      mItemW: el.tournamentMembersListItems[0].offsetWidth,
      mGap: getGap(cfg.tournamentMembersGaps),
      mVICV: getVisibleElements(el.tournamentMembersContainer.offsetWidth, el.tournamentMembersListItems[0].offsetWidth, getGap(cfg.tournamentMembersGaps)),
      mTotalSlides:
        cfg.tournamentMembersCount /
        getVisibleElements(el.tournamentMembersContainer.offsetWidth, el.tournamentMembersListItems[0].offsetWidth, getGap(cfg.tournamentMembersGaps)),
      mInitOffset: getOffset(el.tournamentMembersListItems[0].offsetWidth, getGap(cfg.tournamentMembersGaps), cfg.tournamentMembersVIO),
    }
  },
  // Applying  config's
  instantAttr = cfg.instantAttr,
  tournamentMembersAutoplay = cfg.tournamentMembersAutoplay,
  tournamentMembersCount = cfg.tournamentMembersCount,
  tournamentMembersVIO = cfg.tournamentMembersVIO,
  tournamentMembersInstant = cfg.tournamentMembersInstantCssVar,
  stagesInstant = cfg.stagesInstantCssVar,
  stagesCurrAttr = cfg.stagesCurrAttr,
  stagesTotalSlides = cfg.stagesSlides,
  // Declaring elements
  animated = el.animated,
  tournamentMembersContainer = el.tournamentMembersContainer,
  tournamentMembersControls = el.tournamentMembersControls,
  tournamentMembersItem = el.tournamentMembersListItems[0],
  tournamentMembersList = el.tournamentMembersList,
  tournamentMembersNextBtn = el.tournamentMembersNextBtn,
  tournamentMembersPrevBtn = el.tournamentMembersPrevBtn,
  tournamentMembersVIC = el.tournamentMembersVIC,
  tournamentMembersTimer = el.tournamentMembersTimer,
  stagesContainer = el.stagesContainer,
  stagesDots = el.stagesDots,
  stagesList = el.stagesList,
  stagesNextBtn = el.stagesNextBtn,
  stagesPrevBtn = el.stagesPrevBtn,
  // Utils
  enableInstantTransform = el =>
    (!el.hasAttribute(instantAttr) || el.getAttribute(instantAttr) === "false") && el.setAttribute(instantAttr, "true"),
  disableInstantTransform = el =>
    el.hasAttribute(instantAttr) && el.getAttribute(instantAttr) === "true" && el.setAttribute(instantAttr, "false"),
  delaydDisableInstantTransform = e => delay(disableInstantTransform(e), 300),
  tournamentMembersObserver = new IntersectionObserver(el =>
    el.forEach(i => syncAutoplay(i.isIntersecting && tournamentMembersAutoplay ? "default" : "pause"))
  ),
  animatedObserver = new IntersectionObserver(el =>
    el.forEach(i => i.target.setAttribute("paused", `${!i.isIntersecting}`))
  ),
  addEventListeners = () => {
    stagesPrevBtn.onclick = () => moveStages(-1, null)
    stagesNextBtn.onclick = () => moveStages(1, null)
    stagesDots.forEach(
      el =>
        (el.onclick = i => {
          moveStages(null, Array.from(stagesDots).indexOf(i.target))
        })
    )
    tournamentMembersPrevBtn.onclick = () => movetournamentMembers(1)
    tournamentMembersNextBtn.onclick = () => movetournamentMembers(-1)
    tournamentMembersControls.onmouseenter = () => syncAutoplay("pause")
    tournamentMembersControls.onmouseleave = () => syncAutoplay("default")
    tournamentMembersList.ontransitionend = () => handleSwap()
    tournamentMembersObserver.observe(tournamentMembersContainer)
    animated.forEach(el => {
      el.onmouseenter = () => el.setAttribute("paused", "true")
      el.onmouseleave = () => el.setAttribute("paused", "false")
      animatedObserver.observe(el)
    })
    window.onresize = () => handleResize()
  },
  // State
  tournamentMembersState = {
    autoplayEnabled: tournamentMembersAutoplay,
    currentIndex: 0,
    isSwap: false, // flag to swap slides from duplicates to corresponding originals after event "transitionend"
    dir: null, // swap direction
    warp: 0, // handled swapping slides
    itemW: 0,
    offset: 0,
    initOffset: 0,
    totalSlides: 0,
    vic: 0,
    gap: 20,
  },
  stagesState = { currentIndex: 0, offset: 0, containerW: 0 },
  init = () => {
    document.documentElement.removeAttribute("class")
    addEventListeners()
    const info = getInfo(el, cfg),
      newtournamentMembersState = {
        itemW: info.mItemW,
        initOffset: info.mInitOffset,
        offset: info.mInitOffset,
        totalSlides: info.mTotalSlides,
        vic: info.mVICV, // tournamentMembers Visible Items Count Value
        gap: info.mGap,
      },
      newStagesState = {
        containerW: info.sContainerW,
      }
    Object.assign(tournamentMembersState, newtournamentMembersState)
    Object.assign(stagesState, newStagesState)
    tournamentMembersVIC.textContent = info.mVICV
    enableInstantTransform(tournamentMembersList)
    tournamentMembersList.style.setProperty(tournamentMembersInstant, info.mInitOffset + "px")
    delaydDisableInstantTransform(tournamentMembersList)
  },
  moveStages = (dir, index) => {
    const { currentIndex, containerW } = stagesState,
      newIndex = dir !== null ? currentIndex + dir : index,
      newOffset = newIndex * (containerW + 20) * -1
    stagesList.style.setProperty(stagesInstant, newOffset + "px")
    stagesPrevBtn.disabled = newIndex === 0
    stagesNextBtn.disabled = newIndex === stagesTotalSlides - 1
    stagesDots[currentIndex].removeAttribute(stagesCurrAttr)
    stagesDots[newIndex].setAttribute(stagesCurrAttr, true)
    stagesState.currentIndex = newIndex
    stagesState.offset = newOffset
  },
  movetournamentMembers = dir => {
    disabletournamentMembersBtns()
    const { currentIndex, totalSlides, gap, vic, offset, itemW } = tournamentMembersState,
      stepW = (itemW + gap) * vic,
      newOffset = dir === -1 ? offset - stepW : offset + stepW,
      newIndex = dir === -1 ? currentIndex + 1 : currentIndex - 1,
      visibleItemsCounter = (newIndex + 1) * vic,
      state = {
        currentIndex: newIndex,
        offset: newOffset,
        dir: dir,
        isSwap: dir === -1 ? newIndex === totalSlides : currentIndex === 0,
      }
    Object.assign(tournamentMembersState, state)
    tournamentMembersVIC.textContent =
      dir === -1 ? (state.isSwap ? vic : visibleItemsCounter) : state.isSwap ? tournamentMembersCount : visibleItemsCounter
    tournamentMembersList.style.setProperty(tournamentMembersInstant, newOffset + "px")
  },
  // tournamentMembers carousel
  handleSwap = () => {
    const { dir, vic, initOffset, isSwap, totalSlides, itemW, gap, warp } = tournamentMembersState
    isSwap &&
      !warp &&
      ((tournamentMembersVIC.textContent = dir === -1 ? vic : tournamentMembersCount),
      (tournamentMembersState.currentIndex = dir === -1 ? 0 : totalSlides - 1),
      (tournamentMembersState.offset = dir === -1 ? initOffset : initOffset + (itemW + gap) * vic * (totalSlides - 1) * -1),
      warpSwap()),
      !warp && enabletournamentMembersBtns()
  },
  warpSwap = () => {
    tournamentMembersState.warp = 1
    enableInstantTransform(tournamentMembersList)
    tournamentMembersList.style.setProperty(tournamentMembersInstant, tournamentMembersState.offset + "px")
    deactivateWarp()
  },
  deactivateWarp = delay(() => {
    tournamentMembersState.isSwap = false
    tournamentMembersState.dir = null
    tournamentMembersState.warp = 0
    disableInstantTransform(tournamentMembersList)
    enabletournamentMembersBtns()
  }, 10),
  enabletournamentMembersBtns = () => {
    tournamentMembersPrevBtn.disabled = false
    tournamentMembersNextBtn.disabled = false
  },
  disabletournamentMembersBtns = () => {
    tournamentMembersPrevBtn.disabled = true
    tournamentMembersNextBtn.disabled = true
  },
  syncAutoplay = state => {
    if (tournamentMembersAutoplay) {
      timer && clearTimeout(timer)
      tournamentMembersState.autoplayEnabled = state === "pause" ? !1 : !0
      if (tournamentMembersState.autoplayEnabled) {
        startTimer()
        timer = setInterval(() => {
          tournamentMembersNextBtn.click()
          startTimer()
        }, 4000)
        tournamentMembersControls.classList.add("tournamentMembers__controls--running")
        tournamentMembersControls.classList.remove("tournamentMembers__controls--paused")
      } else {
        stopTimer()
        tournamentMembersControls.classList.add("tournamentMembers__controls--paused")
        tournamentMembersControls.classList.remove("tournamentMembers__controls--running")
      }
    }
  },
  handleResize = () => {
    if (size) return
    syncAutoplay("pause")
    enableInstantTransform(tournamentMembersList)
    enableInstantTransform(stagesList)
    delaydResizeChanges()
    size = true
  },
  delaydResizeChanges = delay(() => {
    const info = getInfo(el, cfg),
      newStagesState = {
        containerW: info.sContainerW,
        offset: info.sOffset,
      },
      newtournamentMembersState = {
        itemW: info.mItemW,
        gap: info.mGap,
        vic: info.mVICV,
        totalSlides: info.mTotalSlides,
        initOffset: info.mInitOffset,
        currentIndex: 0,
        offset: info.mInitOffset,
      }
    Object.assign(stagesState, newStagesState)
    Object.assign(tournamentMembersState, newtournamentMembersState)
    stagesList.style.setProperty(stagesInstant, info.sOffset + "px")
    disableInstantTransform(stagesList)
    tournamentMembersVIC.textContent = info.mVICV
    tournamentMembersList.style.setProperty(tournamentMembersInstant, info.mInitOffset + "px")
    disableInstantTransform(tournamentMembersList)
    size = false
    syncAutoplay("default")
  }, 250),
  // tournamentMembers progress timer
  now = () => performance.now(),
  update = () => {
    if (!isRunning) return
    const delta = now() - startTime,
      difference = 4e3 - delta,
      percent = Math.max(0, Math.min(100, (difference / 4e3) * 100))
    tournamentMembersTimer.style.setProperty("--progress", percent)
    difference > 0 && requestAnimationFrame(update)
  },
  startTimer = () => {
    startTime = now()
    isRunning = !0
    tournamentMembersTimer.style.setProperty("--visibility", "visible")
    requestAnimationFrame(update)
  },
  stopTimer = () => {
    isRunning = !1
    tournamentMembersTimer.style.setProperty("--visibility", "hidden")
    cancelAnimationFrame(update)
  }
document.addEventListener("DOMContentLoaded", () => {
  init()
})
