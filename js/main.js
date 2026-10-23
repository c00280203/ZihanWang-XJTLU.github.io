document.addEventListener('DOMContentLoaded', () => {
    // ============ 1. 自定义鼠标跟随 ============
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 悬停在可交互元素上时鼠标变大
    document.querySelectorAll('a, .btn, .card, .tags span').forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
        });
    });

    // ============ 2. 中英文切换 ============
    const langBtn = document.getElementById('lang-toggle');
    const typewriterEl = document.getElementById('typewriter');
    const texts = {
        en: "MSc AI Student @ XJTLU | Teaching Assistant",
        zh: "西浦人工智能硕士在读 ｜ 课程助教"
    };
    let currentLang = 'en';

    // 打字机效果（支持重新触发）
    let typeTimer = null;
    function typeWriter() {
        clearTimeout(typeTimer);
        typewriterEl.textContent = '';
        const text = texts[currentLang];
        let i = 0;
        (function tick() {
            if (i < text.length) {
                typewriterEl.textContent += text.charAt(i);
                i++;
                typeTimer = setTimeout(tick, currentLang === 'zh' ? 130 : 70);
            }
        })();
    }

    function setLang(lang) {
        currentLang = lang;
        document.body.classList.toggle('zh', lang === 'zh');
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        typeWriter();
    }

    langBtn.addEventListener('click', () => {
        setLang(currentLang === 'en' ? 'zh' : 'en');
    });

    // ============ 3. 平滑滚动（导航锚点） ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============ 4. 滚动渐入动画 (Intersection Observer) ============
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ============ 5. 时间线滚动进度线 ============
    const timeline = document.querySelector('.timeline');
    const progress = document.querySelector('.timeline-progress');
    function updateProgress() {
        if (!timeline || !progress) return;
        const rect = timeline.getBoundingClientRect();
        const viewportH = window.innerHeight;
        // 进度 = 视口底部相对时间线顶部的距离
        const filled = Math.min(Math.max(viewportH * 0.7 - rect.top, 0), rect.height);
        progress.style.height = filled + 'px';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    // ============ 6. 3D 倾斜卡片 ============
    document.querySelectorAll('.tilt').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform =
                `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-3px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // ============ 7. 技能标签点击弹跳 ============
    document.querySelectorAll('.tags span').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.remove('pop');
            void tag.offsetWidth; // 重置动画
            tag.classList.add('pop');
        });
        tag.addEventListener('animationend', () => tag.classList.remove('pop'));
    });

    // ============ 8. 导航高亮当前分区 ============
    const navAnchors = document.querySelectorAll('.nav-links a');
    const sectionMap = new Map();
    navAnchors.forEach(a => {
        const id = a.getAttribute('href').slice(1);
        const sec = document.getElementById(id);
        if (sec) sectionMap.set(sec, a);
    });
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const link = sectionMap.get(entry.target);
            if (link && entry.isIntersecting) {
                navAnchors.forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { threshold: 0.3 });
    sectionMap.forEach((_, sec) => navObserver.observe(sec));

    // 初始打字机
    setTimeout(typeWriter, 500);
});
