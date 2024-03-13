"use strict"

// Меню (бургер) ===================================================

document.addEventListener('click', documentAction)

function documentAction(e) {
	const targetElement = e.target

	if (targetElement.closest('.icon-menu')) {
		document.documentElement.classList.toggle('menu-open')
	} else if (targetElement.closest('.menu')) {
		if (document.documentElement.classList.contains('menu-open')) {
			document.documentElement.classList.remove('menu-open')
		}
    }
}

// Counters ========================================================

let valueDisplays = document.querySelectorAll(".hero__counter-number");
let interval = 1800;

const startCounter = (valueDisplay) => {
    let startValue = 0;
    let endValue = parseInt(valueDisplay.getAttribute("data-value"));
    let duration = Math.floor(interval / endValue);
    let counter = setInterval(function () {
        startValue += 1;
        valueDisplay.textContent = startValue;
        if (startValue == endValue) {
            clearInterval(counter);
        }
    }, duration);
};

const intersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
};

const observerOptions = {
    threshold: 0.5,
};

const intersectionObserver = new IntersectionObserver(
    intersectionObserverCallback,
    observerOptions
);

valueDisplays.forEach((valueDisplay) => {
    intersectionObserver.observe(valueDisplay);
});

// Show when scrolling =================================================================

let options = {
	root: null,
	rootMargin: "0px 0px 0px 0px",
	threshold: 0.3,
};

let callback = (entries, observer) => {
	entries.forEach((entry) => {
		const targetElement = entry.target;
		if (entry.isIntersecting) {
			if (targetElement.classList.contains("anim-left")) {
                targetElement.classList.add("show-left");
              } else if (targetElement.classList.contains("anim-right")) {
                targetElement.classList.add("show-right");
              } else {
                targetElement.classList.add("show");
              }
        }
	});
}

let observer = new IntersectionObserver(callback, options);

let someElements = document.querySelectorAll("[class*='--anim']");
someElements.forEach(someElement => {
	observer.observe(someElement);
});

// Button Up ======================================================

let buttonUp = document.querySelector('.button-up');
let isScrolling;

buttonUp.addEventListener('mouseenter', function() {
    clearTimeout(isScrolling);
    buttonUp.style.opacity = 1;
    buttonUp.style.bottom = '30px';
});

buttonUp.addEventListener('mouseleave', function() {
    isScrolling = setTimeout(function() {
        buttonUp.style.opacity = 0;
        buttonUp.style.bottom = '-100px';
    }, 5000);
});

buttonUp.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', function() {
    if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
        buttonUp.style.opacity = 1;
        buttonUp.style.bottom = '30px';
    } else {
        buttonUp.style.opacity = 0;
        buttonUp.style.bottom = '-100px';
    }   

    clearTimeout(isScrolling);

    isScrolling = setTimeout(function() {
        buttonUp.style.opacity = 0;
        buttonUp.style.bottom = '-100px';
    }, 5000);
});

// Mouse Parallax =================================================

class MousePRLX {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			logging: true,
		}
		this.config = Object.assign(defaultConfig, props);
		if (this.config.init) {
			const paralaxMouse = document.querySelectorAll('[data-prlx-mouse]');
			if (paralaxMouse.length) {
				this.paralaxMouseInit(paralaxMouse);
			}
		}
	}
	paralaxMouseInit(paralaxMouse) {
		paralaxMouse.forEach(el => {
			const paralaxMouseWrapper = el.closest('[data-prlx-mouse-wrapper]');

			// Коеф. X 
			const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
			// Коеф. У 
			const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
			// Напр. Х
			const directionX = el.hasAttribute('data-prlx-dxr') ? -1 : 1;
			// Напр. У
			const directionY = el.hasAttribute('data-prlx-dyr') ? -1 : 1;
			// Швидкість анімації
			const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;


			// Оголошення змінних
			let positionX = 0, positionY = 0;
			let coordXprocent = 0, coordYprocent = 0;

			setMouseParallaxStyle();

			// Перевіряю на наявність батька, в якому зчитуватиметься становище миші
			if (paralaxMouseWrapper) {
				mouseMoveParalax(paralaxMouseWrapper);
			} else {
				mouseMoveParalax();
			}

			function setMouseParallaxStyle() {
				const distX = coordXprocent - positionX;
				const distY = coordYprocent - positionY;
				positionX = positionX + (distX * paramAnimation / 1000);
				positionY = positionY + (distY * paramAnimation / 1000);
				el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0) rotate(0.02deg);`;
				requestAnimationFrame(setMouseParallaxStyle);
			}
			function mouseMoveParalax(wrapper = window) {
				wrapper.addEventListener("mousemove", function (e) {
					const offsetTop = el.getBoundingClientRect().top + window.scrollY;
					if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
						// Отримання ширини та висоти блоку
						const parallaxWidth = window.innerWidth;
						const parallaxHeight = window.innerHeight;
						// Нуль посередині
						const coordX = e.clientX - parallaxWidth / 2;
						const coordY = e.clientY - parallaxHeight / 2;
						// Отримуємо відсотки
						coordXprocent = coordX / parallaxWidth * 100;
						coordYprocent = coordY / parallaxHeight * 100;
					}
				});
			}
		});
	}

}

// Запускаємо та додаємо в об'єкт модулів
const prlxMouse = new MousePRLX({});

// showMore ==============================================

document.addEventListener("DOMContentLoaded", function () {
	const itemsToShow = 3;
	const itemMetawork = document.querySelectorAll(".work__card");
	const showMoreBtn = document.querySelector(".work__showmore");

	let itemsShown = itemsToShow; // Початкова кількість показаних елементів

	function toggleItems() {
		if (window.innerWidth <= 650) {
			itemMetawork.forEach((item, index) => {
				if (index < itemsShown) {
					item.style.display = "flex";
				} else {
					item.style.display = "none";
				}
			});
		} else {
			itemMetawork.forEach(item => {
				item.style.display = "flex";
			});
		}

		// Перевіряємо, чи всі елементи вже видимі, і змінюємо текст кнопки відповідно
		if (itemsShown === itemMetawork.length) {
			showMoreBtn.textContent = "Show less";
		} else {
			showMoreBtn.textContent = "Show more";
		}
	}

	toggleItems(); // Викликаємо перевірку вікна при завантаженні сторінки

	showMoreBtn.addEventListener("click", function () {
		if (itemsShown === itemMetawork.length) {
			// Якщо всі елементи вже видимі, ховаємо їх по одному, починаючи з останнього
			itemsShown = itemsToShow;
			toggleItems();
		} else {
			// Якщо ще є елементи, які не відображені, показуємо наступний елемент
			itemsShown++;
			toggleItems();
		}
	});

	window.addEventListener("resize", toggleItems); // Викликаємо перевірку вікна при зміні розміру вікна
});

// Слайдер

const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    autoHeight: true,
    loop: true,
    speed: 1500,
    loop: true,
    spaceBetween: 20,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
        },
        650: {
            slidesPerView: 1.1,
        },
    }
});

// Video

function toggleVideo(video, parentEl) {
    if (video.paused) {
      playVideo(video, parentEl);
    } else {
      pauseVideo(video, parentEl);
    }
}
  
function playVideo(video, parentEl) {
      video.play();
      video.setAttribute("controls", "");
      parentEl.classList.add("_playing");
    
}
  
function pauseVideo(video, parentEl) {
    if (!video.paused) {
      video.pause();
      video.removeAttribute("controls", "");
      parentEl.classList.remove("_playing");
    }
}
  
  function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      const video = entry.target.querySelector("video");
      const parentEl = entry.target;
  
      if (!entry.isIntersecting) {
        pauseVideo(video, parentEl);
      }
    });
  }
  
  window.onload = () => {
    const observerOptions = {
      threshold: 0.5,
    };
  
    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );
  
    document.querySelectorAll(".video-block__frame").forEach((videoBox) => {
      observer.observe(videoBox);
    });
  
    document.addEventListener("click", function (e) {
      const parentEl = e.target.closest(".video-block__frame");
  
      if (parentEl) {
        const video = parentEl.querySelector("video");
        toggleVideo(video, parentEl);
      }
    });
  };