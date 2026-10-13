<script setup>
import RepoIcon from './RepoIcon.vue'

const links = [
  {
    name: 'GITHUB',
    id: '@wjl-cong',
    type: 'github',
    url: 'https://github.com/wjl-cong',
    avatar: 'avatars/github.png'
  },
  {
    name: 'GITEE',
    id: '@wjl2004',
    type: 'gitee',
    url: 'https://gitee.com/wjl2004',
    avatar: 'avatars/gitee.png'
  }
]
</script>

<template>
  <section id="contact" class="contact">
    <div class="sec-label center">04 — 联系 / CONTACT</div>
    <div class="contact-big reveal">
      LET'S BUILD
      <span class="outline">SOMETHING GREAT</span>
    </div>
    <p class="contact-sub">保持创造 · KEEP BUILDING</p>
    <div class="contact-links">
      <a v-for="l in links" :key="l.name" class="contact-card" :href="l.url" target="_blank" rel="noopener">
        <span class="cc-ava"><img :src="l.avatar" :alt="l.name" loading="lazy" /></span>
        <RepoIcon :type="l.type" />
        <span>
          <span class="cc-name">{{ l.name }}</span><br />
          <span class="cc-id">{{ l.id }}</span>
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.contact {
  text-align: center;
  padding-bottom: 60px;
  overflow: hidden;
}

.contact-big {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 7.5vw, 6.4rem);
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.contact-big .outline {
  color: transparent;
  -webkit-text-stroke: 1.2px rgba(242, 242, 240, 0.7);
  display: block;
}

.contact-sub {
  margin-top: 26px;
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 4px;
  color: var(--ink-dim);
}

.contact-links {
  margin-top: 54px;
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--line);
  background: var(--glass);
  backdrop-filter: blur(8px);
  padding: 20px 34px;
  border-radius: 14px;
  transition: border-color 0.3s, transform 0.3s, background 0.3s;
}

/* 圆形头像：accent 渐变描边环 */
.cc-ava {
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 0 1px var(--line);
  transition: box-shadow 0.3s, transform 0.3s;
}

.cc-ava img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.contact-card:hover .cc-ava {
  transform: scale(1.06);
  box-shadow: 0 0 18px rgba(158, 203, 255, 0.4);
}

html.light .contact-card:hover .cc-ava {
  box-shadow: 0 0 14px rgba(47, 111, 206, 0.35);
}

.contact-card:hover {
  border-color: rgba(158, 203, 255, 0.45);
  transform: translateY(-4px);
  background: rgba(158, 203, 255, 0.04);
}

.contact-card :deep(svg) {
  width: 22px;
  height: 22px;
  fill: var(--ink-dim);
  transition: fill 0.3s;
}

.contact-card:hover :deep(svg) {
  fill: var(--accent);
}

.cc-name {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--ink);
}

.cc-id {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--ink-faint);
}
</style>
