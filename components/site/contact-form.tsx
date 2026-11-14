'use client'

import { useEffect, useRef, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { pillClass } from './pill-link'

// お問い合わせフォーム（2026-11-14 本人：メールアドレスを出さずフォームにする）。
// 受付は /api/contact.php（さくら上のPHP）。宛先・差出人はPHP側で固定、自動返信はしない。
// フォームを開くと受付票（3秒〜2時間有効・1回きり）を受け取り、送信時に一緒に送る。見えない罠の欄もある。
const ENDPOINT = `${process.env.NEXT_PUBLIC_SITE_BASE ?? ''}/api/contact.php`

type Text = {
  heading: string
  lead: string
  kinds: Record<'order' | 'media' | 'event' | 'other', string>
  kind: string
  name: string
  email: string
  tel: string
  telNote: string
  message: string
  messagePh: string
  orderNote: string
  agree: string
  required: string
  send: string
  sending: string
  done: (no: string) => string
  errors: Record<string, string>
  unavailable: string
}

const T: Record<Lang, Text> = {
  ja: {
    heading: 'お問い合わせ',
    lead: 'お店へのご質問、取材・催事のご相談などはこちらから。内容を確認し、メールでご返信いたします（数日いただくことがあります）。',
    kinds: { order: 'ご予約・ご注文について', media: '取材・メディアのご依頼', event: '催事・卸・法人のご相談', other: 'その他' },
    kind: 'お問い合わせの種類',
    name: 'お名前',
    email: 'メールアドレス',
    tel: 'お電話番号',
    telNote: '任意',
    message: 'お問い合わせ内容',
    messagePh: 'ご質問やご相談の内容をお書きください。',
    orderNote: 'ご予約の受付・変更・取り消しは、ご予約ページ（確認メールのご案内）からお手続きいただけます。',
    agree: 'ご記入いただいた内容は、お問い合わせへの回答のためにだけ使います。',
    required: '必須',
    send: '送信する',
    sending: '送信しています…',
    done: (no) => `お問い合わせを受け付けました（受付番号 ${no}）。内容を確認し、ご入力のメールアドレスへご返信いたします。`,
    errors: {
      kind: 'お問い合わせの種類を選んでください。',
      name: 'お名前を入れてください。',
      email: 'メールアドレスの形をご確認ください。',
      tel: 'お電話番号は数字でご入力ください。',
      message: 'お問い合わせ内容を5文字以上でお書きください。',
      agree: '内容の使い方をご確認のうえ、チェックを入れてください。',
      spam: 'リンクが多い内容はお送りいただけません。リンクは2つまでにしてください。',
      ticket: '画面を開いてから時間がたちました。お手数ですが、もう一度「送信する」を押してください。',
      rate: '短い間に何度も送られています。少し時間をおいてからお試しください。',
      server: '送信できませんでした。時間をおいてもう一度お試しください。',
    },
    unavailable: 'この画面ではフォームをお使いいただけません。dorayama.com からお問い合わせください。',
  },
  en: {
    heading: 'Contact',
    lead: 'For questions about the shop, press or event inquiries, please use this form. We will reply by email (it may take a few days).',
    kinds: { order: 'Reservations / orders', media: 'Press / media', event: 'Events / wholesale / corporate', other: 'Other' },
    kind: 'Type of inquiry',
    name: 'Name',
    email: 'Email',
    tel: 'Phone',
    telNote: 'optional',
    message: 'Message',
    messagePh: 'Please write your question or request.',
    orderNote: 'To make, change or cancel a reservation, please use the reservation page (see your confirmation email).',
    agree: 'We use what you enter only to reply to your inquiry.',
    required: 'required',
    send: 'Send',
    sending: 'Sending…',
    done: (no) => `Thank you. We have received your message (No. ${no}) and will reply by email.`,
    errors: {
      kind: 'Please choose the type of inquiry.',
      name: 'Please enter your name.',
      email: 'Please check your email address.',
      tel: 'Please enter your phone number in digits.',
      message: 'Please write at least 5 characters.',
      agree: 'Please tick the box to continue.',
      spam: 'Please include no more than two links.',
      ticket: 'The page has been open for a while. Please press Send again.',
      rate: 'Too many messages in a short time. Please try again later.',
      server: 'We could not send your message. Please try again later.',
    },
    unavailable: 'The form is not available on this page. Please contact us from dorayama.com.',
  },
  zh: {
    heading: '联系我们',
    lead: '关于店铺的问题、采访或活动合作等，请通过此表单联系我们。我们将通过电子邮件回复（可能需要几天时间）。',
    kinds: { order: '预约・订单', media: '采访・媒体', event: '活动・批发・企业合作', other: '其他' },
    kind: '咨询类型',
    name: '姓名',
    email: '电子邮箱',
    tel: '电话',
    telNote: '选填',
    message: '咨询内容',
    messagePh: '请填写您的问题或需求。',
    orderNote: '预约的受理、变更、取消，请通过预约页面（确认邮件中的链接）办理。',
    agree: '您填写的内容仅用于回复本次咨询。',
    required: '必填',
    send: '发送',
    sending: '发送中…',
    done: (no) => `已收到您的咨询（受理编号 ${no}）。我们将通过电子邮件回复。`,
    errors: {
      kind: '请选择咨询类型。',
      name: '请填写姓名。',
      email: '请确认电子邮箱的格式。',
      tel: '电话请填写数字。',
      message: '请填写5个字以上的内容。',
      agree: '请勾选确认。',
      spam: '链接请控制在2个以内。',
      ticket: '页面打开时间较长，请再按一次“发送”。',
      rate: '短时间内发送次数过多，请稍后再试。',
      server: '发送失败，请稍后再试。',
    },
    unavailable: '此页面无法使用表单，请从 dorayama.com 联系我们。',
  },
  ko: {
    heading: '문의',
    lead: '가게에 대한 질문, 취재・행사 상담 등은 이 양식으로 보내 주세요. 이메일로 답변드립니다(며칠 걸릴 수 있습니다).',
    kinds: { order: '예약・주문', media: '취재・미디어', event: '행사・도매・법인 상담', other: '기타' },
    kind: '문의 종류',
    name: '이름',
    email: '이메일',
    tel: '전화번호',
    telNote: '선택',
    message: '문의 내용',
    messagePh: '질문이나 상담 내용을 적어 주세요.',
    orderNote: '예약 접수・변경・취소는 예약 페이지(확인 메일 안내)에서 해 주세요.',
    agree: '입력하신 내용은 문의 답변에만 사용합니다.',
    required: '필수',
    send: '보내기',
    sending: '보내는 중…',
    done: (no) => `문의를 접수했습니다(접수 번호 ${no}). 입력하신 이메일로 답변드리겠습니다.`,
    errors: {
      kind: '문의 종류를 선택해 주세요.',
      name: '이름을 입력해 주세요.',
      email: '이메일 형식을 확인해 주세요.',
      tel: '전화번호는 숫자로 입력해 주세요.',
      message: '5자 이상 적어 주세요.',
      agree: '확인란에 체크해 주세요.',
      spam: '링크는 2개까지만 넣어 주세요.',
      ticket: '페이지를 연 지 시간이 지났습니다. 다시 한 번 보내기를 눌러 주세요.',
      rate: '짧은 시간에 여러 번 보내셨습니다. 잠시 후 다시 시도해 주세요.',
      server: '보내지 못했습니다. 잠시 후 다시 시도해 주세요.',
    },
    unavailable: '이 페이지에서는 양식을 사용할 수 없습니다. dorayama.com에서 문의해 주세요.',
  },
}

const field = 'w-full rounded-none border border-paper/25 bg-transparent px-4 py-3 text-[14px] tracking-[0.06em] text-paper placeholder:text-paper/35 transition-colors focus:border-paper/70 focus:outline-none'

export function ContactForm({ lang = 'ja' }: { lang?: Lang }) {
  const t = T[lang]
  const [ticket, setTicket] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'off'>('idle')
  const [errs, setErrs] = useState<string[]>([])
  const [no, setNo] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const getTicket = () =>
    fetch(`${ENDPOINT}?ticket=1`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setTicket(d.ticket))
      .catch(() => setState('off'))

  useEffect(() => {
    getTicket()
  }, [])

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (state === 'sending') return
    setState('sending')
    setErrs([])
    const fd = new FormData(ev.currentTarget)
    fd.set('ticket', ticket)
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', body: new URLSearchParams(fd as unknown as Record<string, string>) })
      const d = await r.json().catch(() => ({}))
      if (r.ok && d.ok) {
        setNo(d.no || '')
        setState('done')
        return
      }
      setErrs(d.fields ?? [d.error === 'ticket' ? 'ticket' : d.error === 'rate' ? 'rate' : 'server'])
      setState('idle')
      getTicket()
    } catch {
      setErrs(['server'])
      setState('idle')
      getTicket()
    }
  }

  const bad = (k: string) => errs.includes(k)
  const label = (text: string, req: boolean, note?: string) => (
    <span className="mb-2 block text-[12px] tracking-[0.12em] text-mute">
      {text}
      <span className="ml-2 text-[10px] tracking-[0.1em] text-paper/50">{req ? t.required : note}</span>
    </span>
  )

  return (
    <div id="contact" className="mt-24 max-w-3xl scroll-mt-28 border-t border-paper/10 pt-16">
      <h3 className="font-mincho text-[20px] tracking-[0.2em] text-paper md:text-[22px]">{t.heading}</h3>
      <p className="mt-6 font-mincho text-[14px] leading-[2.1] tracking-[0.08em] text-mute">{t.lead}</p>

      {state === 'done' ? (
        <p role="status" className="mt-10 border border-paper/25 px-6 py-6 text-[14px] leading-loose tracking-[0.06em] text-paper">
          {t.done(no)}
        </p>
      ) : state === 'off' ? (
        <p className="mt-10 text-[13px] tracking-[0.06em] text-mute">{t.unavailable}</p>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-10 grid gap-7">
          <label className="block">
            {label(t.kind, true)}
            <select name="kind" required defaultValue="" className={cn(field, 'appearance-none', bad('kind') && 'border-copper')}>
              <option value="" disabled>—</option>
              {Object.entries(t.kinds).map(([k, v]) => (
                <option key={k} value={k} className="bg-[#16301f] text-paper">{v}</option>
              ))}
            </select>
          </label>
          <p className="-mt-3 text-[12px] leading-relaxed tracking-[0.06em] text-mute">{t.orderNote}</p>
          <div className="grid gap-7 md:grid-cols-2">
            <label className="block">
              {label(t.name, true)}
              <input name="name" required maxLength={50} autoComplete="name" className={cn(field, bad('name') && 'border-copper')} />
            </label>
            <label className="block">
              {label(t.tel, false, t.telNote)}
              <input name="tel" maxLength={20} inputMode="tel" autoComplete="tel" className={cn(field, bad('tel') && 'border-copper')} />
            </label>
          </div>
          <label className="block">
            {label(t.email, true)}
            <input name="email" type="email" required maxLength={120} autoComplete="email" className={cn(field, bad('email') && 'border-copper')} />
          </label>
          <label className="block">
            {label(t.message, true)}
            <textarea name="message" required rows={7} maxLength={2000} placeholder={t.messagePh}
              className={cn(field, 'resize-y leading-relaxed', (bad('message') || bad('spam')) && 'border-copper')} />
          </label>
          {/* 人には見えない罠の欄（機械だけが埋める） */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <label className="flex items-start gap-3 text-[13px] leading-relaxed tracking-[0.06em] text-paper">
            <input type="checkbox" name="agree" value="1" className="mt-1 h-4 w-4 accent-[#b87333]" />
            <span>{t.agree}</span>
          </label>
          {errs.length > 0 && (
            <ul role="alert" className="grid gap-1 text-[13px] leading-relaxed tracking-[0.04em] text-copper">
              {errs.map((k) => (
                <li key={k}>{t.errors[k] ?? t.errors.server}</li>
              ))}
            </ul>
          )}
          <div>
            <button type="submit" disabled={state === 'sending' || !ticket} className={cn(pillClass, 'px-10 disabled:opacity-50')}>
              {state === 'sending' ? t.sending : t.send}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
