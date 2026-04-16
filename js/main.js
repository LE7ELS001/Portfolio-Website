const initIcons = () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};


function navigateTo(pageId, element) {
    const currentPage = document.querySelector('.page-content.active');
    const targetPage = document.getElementById('page-' + pageId);

    if (!targetPage || currentPage === targetPage) return;

    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => link.classList.remove('active'));

    let activeLink = element;
    if (!activeLink) {
        activeLink = Array.from(navLinks).find(link =>
            link.innerText.toLowerCase().includes(pageId === 'home' ? 'home' : pageId)
        );
    }

    if (activeLink) {
        activeLink.classList.add('active');
        moveUnderline(activeLink);
    }

    if (currentPage) {
        currentPage.classList.add('leaving');
    }

    targetPage.classList.add('entering');
    targetPage.classList.add('active');

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            targetPage.classList.remove('entering');
            if (currentPage) {
                currentPage.classList.remove('active');
            }
        });
    });

    setTimeout(() => {
        if (currentPage) {
            currentPage.classList.remove('leaving');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);
}

function scrollToPreview(sectionId) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active'));

    const homePage = document.getElementById('page-home');
    if (homePage) {
        homePage.classList.add('active');
    }

    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => link.classList.remove('active'));

    const homeLink = Array.from(navLinks).find(link =>
        link.innerText.toLowerCase().includes('home')
    );
    if (homeLink) {
        homeLink.classList.add('active');
        moveUnderline(homeLink);
    }

    const target = document.getElementById(sectionId);
    if (target) {
        smoothScrollTo(target, 50);
    }
}

/**
 * 2. 导航下划线跟随动画
 */
function moveUnderline(element) {
    const underline = document.getElementById('nav-underline');
    if (underline && element) {
        underline.style.width = element.offsetWidth + 'px';
        underline.style.left = element.offsetLeft + 'px';
    }
}

/**
 * 3. 背景视差滚动效果
 */
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const overlay = document.querySelector('.bg-overlay');
        if (overlay) {
            overlay.style.transform = `scale(1.1) translateY(${scrolled * 0.1}px)`;
        }
    });
}


/**
 * 4. 处理滚动视觉效果
 */
const handleScrollEffects = () => {
    const scrolled = window.scrollY;

    // 背景图片视差
    const overlay = document.querySelector('.bg-overlay');
    if (overlay) {
        overlay.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
    }

    // 滚动指示器淡出
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
        indicator.style.opacity = Math.max(0, 0.4 - (scrolled / 400));
    }

    // 导航栏背景切换
    const header = document.querySelector('header');
    if (header) {
        if (scrolled > 50) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = 'none';
        }
    }
};

function goToPage(url) {
    document.body.classList.add('page-leaving');
    setTimeout(() => {
        window.location.href = url;
    }, 250);
}

function smoothScrollTo(target, duration = 800) {
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY;
    const distance = end - start;

    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;

        const progress = Math.min(timeElapsed / duration, 1);

        // easeInOut（更顺滑）
        const ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        window.scrollTo(0, start + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

/**
 * 页面加载完成后的主程序
 */
window.onload = () => {
    initIcons();


    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 初始化导航线
    const initialActive = document.querySelector('#main-nav a.active');
    if (initialActive) moveUnderline(initialActive);

    // 启动视差效果
    initParallax();

    console.log("SPA Portfolio Navigation Ready.");
    // debug
    console.log("Level Designer Portfolio Loaded Successfully.");

    const navLinks = document.querySelectorAll('#main-nav a');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // 如果不是当前 active 才移动
            if (!link.classList.contains('active')) {
                moveUnderline(link);
            }
        });

        link.addEventListener('mouseleave', () => {
            // 回到 active 的位置
            const activeLink = document.querySelector('#main-nav a.active');
            if (activeLink) {
                moveUnderline(activeLink);
            }
        });
    });

    window.addEventListener('scroll', handleScrollEffects);

    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');

    if (view === 'projects') {
        const navProjects = document.getElementById('nav-projects');
        navigateTo('projects', navProjects);
    }



    //image zoom
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightboxEl = document.getElementById('lightbox');
    const lightboxImgEl = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    function openLightbox(src, alt = '') {
        if (!lightboxEl || !lightboxImgEl) return;
        lightboxImgEl.src = src;
        lightboxImgEl.alt = alt;
        lightboxEl.classList.add('active');
    }

    function closeLightbox() {
        if (lightboxEl) {
            lightboxEl.classList.remove('active');
        }
    }

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxEl) {
        lightboxEl.addEventListener('click', (e) => {
            if (e.target === lightboxEl) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });


    //image slide
    document.querySelectorAll('[data-slider]').forEach(slider => {
        const images = slider.querySelectorAll('.slider-image');
        const prevBtn = slider.querySelector('[data-prev]');
        const nextBtn = slider.querySelector('[data-next]');
        const dots = slider.querySelectorAll('.dot');

        let currentIndex = 0;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            currentIndex = index;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + images.length) % images.length;
                showSlide(newIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % images.length;
                showSlide(newIndex);
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
            });
        });

        images.forEach(img => {
            img.addEventListener('click', () => {
                openLightbox(img.src, img.alt);
            });
        });

        showSlide(0);
    });

    document.querySelectorAll('.zoomable').forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
    });
};