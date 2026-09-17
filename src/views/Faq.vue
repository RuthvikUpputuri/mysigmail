<script setup lang="ts">
import { onMounted, ref } from 'vue'

const items = [
  {
    category: 'How to install the email signature for',
    questions: [
      {
        title: 'Gmail',
        content: `<ul >
          <li>Login to EmailSign.</li>
          <li>Click the <b>Get Signature</b> button then select <b>Copy as Select</b>.</li>
          <li>Open Gmail, click the Settings gear icon in the top right corner, then select <b>See all settings</b>.</li>
          <li>Scroll down to the <b>Signature</b> section.</li>
          <li>Click the <b>Create new</b> button.</li>
          <li>Enter a name for the signature.</li>
          <li>Click the <b>Create</b> button.</li>
          <li>Paste your signature (Cmd + V on Mac or Ctrl + V on Windows) into the signature box.</li>
          <li>Scroll down to the bottom of the page and click <b>Save Changes</b>.</li>
        </ul>`,
      },
      {
        title: 'Outlook',
        content: `<ul >
          <li>Login to EmailSign.</li>
          <li>Click the <b>Get Signature</b> button then select <b>Copy as Select</b>.</li>
          <li>Open Outlook, select <b>Outlook > Preferences</b> from the top menu bar.</li>
          <li>Under <b>Email</b>, click <b>Signatures</b>.</li>
          <li>Click the "+" button to add a new signature.</li>
          <li>Paste your signature (Cmd + V on Mac or Ctrl + V on Windows) into the signature box.</li>
          <li>Select the default signature for your account.</li>
        </ul>`,
      },
      {
        title: 'Outlook (Web)',
        content: `<ul >
          <li>Login to EmailSign.</li>
          <li>Click the <b>Get Signature</b> button then select <b>Copy as Select</b>.</li>
          <li>Open Outlook Web, click the Settings gear icon in the top right corner, then select <b>View all Outlook settings</b>.</li>
          <li>Go to <b>Mail > Compose and reply</b>.</li>
          <li>Under Email signature, click <b>New signature</b>.</li>
          <li>Enter a name for the signature.</li>
          <li>Paste your signature (Cmd + V on Mac or Ctrl + V on Windows) into the signature box.</li>
          <li>Click <b>Save</b>.</li>
        </ul>`,
      },
      {
        title: 'Apple Mail',
        content: `<ul >
          <li>Login to EmailSign.</li>
          <li>Click the <b>Get Signature</b> button then select <b>Copy as Select</b>.</li>
          <li>Open Apple Mail, go to Preferences (Cmd + , or <b>Mail > Preferences > Signatures</b>).</li>
          <li>Choose Google to add the signature to all accounts or choose a specific account.</li>
          <li>Click the "+" button.</li>
          <li>Uncheck the box <b>Always match my default message font</b>.</li>
          <li>Paste your signature (Cmd + V) into the signature section.</li>
        </ul>
        <div class="mt-4 p-4 bg-red-100 border-red-500 text-slate-700 dark:bg-yellow-900/20 rounded border dark:border-red-800 text-sm dark:text-slate-300">
          <strong class="text-red-600 dark:text-slate-300">Warning:</strong> Do not copy your signature from Safari; use Google Chrome instead. Safari tends to alter the signature upon copying, resulting in larger images that cause the template to display incorrectly.
        </div>
        <div class="mt-4 p-4 bg-blue-100 border-blue-200 text-slate-700 dark:bg-blue-900/20 rounded border dark:border-blue-800 text-sm dark:text-slate-300">
          <strong>Note:</strong> When pasting into Apple Mail, it may initially look like a blank image with incorrect text; composing a new email will show the signature correctly.
        </div>`,
      },
      {
        title: 'Spark',
        content: `<ul >
          <li>Login to EmailSign.</li>
          <li>Click the <b>Get Signature</b> button then select <b>Copy as HTML</b>.</li>
          <li>Open Spark, go to Preferences (Cmd + , or <b>Spark > Preferences > Signatures</b>).</li>
          <li>Click the "+" button.</li>
          <li>Uncheck the box <b>Always use default font (SF)</b>.</li>
          <li>Click the <b>"HTML"</b> button.</li>
          <li>Paste your signature (Cmd + V) into the signature section.</li>
        </ul>`,
      },
    ],
  },
  {
    category: 'Tips',
    questions: [
      {
        title: 'Round Avatar',
        content: '<p >To use a round avatar, upload your image and choose 1:1 cropping.</p><p > <strong class="text-blue-500 dark:text-slate-200">Note: </strong>Round option also works for other aspect ratios but will crop the image to oval, rounded square or circle depending on the aspect ratio.</p>',
      },
      {
        title: 'Using GIF Images',
        content: '<p >An animated GIF can be a great way to make your signature more dynamic and draw attention to a promotion, a call-to-action (CTA), or your brand\'s personality. </p><p >However, it\'s important to use them wisely. Keep in mind that some email clients, like older versions of Outlook, do not support animation and will only show the first frame of the GIF. Therefore, ensure the first frame is a high-quality static image that conveys your message effectively on its own. </p><p >To ensure good performance and deliverability, GIF images are uploaded without cropping and have a maximum file size of 1MB. Keep the animation short and simple to avoid distracting the reader.</p>',
      },
    ],
  },
  {
    category: 'Known Issues',
    questions: [
      {
        title: 'Link Underlined',
        content: '<p >Chrome has a copy/paste behavior bug that may underline links. Copying your signature using Firefox or Non-Chromium browsers resolves this issue (you can return to Chrome afterward).</p>',
      },
      {
        title: 'Large Images',
        content: `<p >Some email clients may ignore the width and height settings applied to images in the signature template, causing them to render at their original, full size. This can make your signature appear distorted or unprofessional.</p><p >For example, you might upload a high-resolution 500x500 pixel logo. Even if you try to visually resize it to a small 50x50 pixel icon in EmailSign, some email clients might still display it at its original 500x500 size, potentially breaking your signature layout.</p><p >To prevent this, it's crucial to resize your images to their intended final dimensions before uploading them to EmailSign platform. This ensures they are optimized for email clients.</p><p >Also do not copy your signature from Safari, use Google Chrome instead. Safari tends to change the signature when you copy/paste, which will result in larger images or distorted signature.</p>`,
      },
    ],
  },
]

const openCategory = ref<string | null>(items[0].category)
const openQuestion = ref<string | null>(null)

function toggleCategory(category: string) {
  openCategory.value = openCategory.value === category ? null : category
}

function getQuestionId(title: string) {
  return title.toLowerCase().replace(/[\s()]+/g, '-').replace(/-$/, '')
}

function toggleQuestion(questionTitle: string) {
  if (openQuestion.value === questionTitle) {
    openQuestion.value = null
    window.history.replaceState(null, '', window.location.pathname)
  }
  else {
    openQuestion.value = questionTitle
    window.location.hash = getQuestionId(questionTitle)
  }
}

onMounted(() => {
  const hash = window.location.hash.slice(1)
  if (hash) {
    for (const section of items) {
      for (const question of section.questions) {
        if (getQuestionId(question.title) === hash) {
          openQuestion.value = question.title
          setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
          return
        }
      }
    }
  }
})
</script>

<template>
  <LayoutsDefault>
    <div class="faq-container pb-10">
      <div
        v-for="section in items"
        :key="section.category"
        class="mb-8"
      >
        <h2 class="text-lg font-bold mb-3 text-foreground">
          {{ section.category }}
        </h2>

        <div class="space-y-0">
          <div
            v-for="question in section.questions"
            :id="getQuestionId(question.title)"
            :key="question.title"
            class="border-b last:border-b-0 border-border"
          >
            <h3 class="flex">
              <button
                type="button"
                :aria-expanded="openQuestion === question.title"
                class="flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all outline-none hover:underline cursor-pointer text-foreground w-full"
                @click="toggleQuestion(question.title)"
              >
                {{ question.title }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground"
                  :class="{ 'rotate-180': openQuestion === question.title }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              v-show="openQuestion === question.title"
              class="pb-4 pt-0 text-sm text-slate-800 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none"
              v-html="question.content"
            />
          </div>
        </div>
      </div>
    </div>
  </LayoutsDefault>
</template>

<style>
.faq-container ul {
  list-style-type: decimal;
  padding-left: 1.2rem;
}
.faq-container li {
  margin-bottom: 0.5rem;
}
</style>
