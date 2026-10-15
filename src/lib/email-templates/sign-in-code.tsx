import * as React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { AUTH_MAIL } from '../auth-email'
import { toLang } from '../i18n'

interface Props { code?: string; lang?: string }

const SignInCode = ({ code = '000000', lang }: Props) => {
  const m = AUTH_MAIL[toLang(lang)]
  return (
    <Html lang={toLang(lang)} dir="ltr">
      <Head />
      <Preview>{m.subject(code)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Vita Nova Life</Heading>
          <Text style={text}>{m.hello}</Text>
          <Text style={text}>{m.yourCode}</Text>
          <Text style={codeStyle}>{code}</Text>
          <Text style={text}>{m.valid}<br />{m.ignore}</Text>
          <Text style={text}>{m.signoff}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SignInCode,
  subject: (d: Record<string, any>) => AUTH_MAIL[toLang(d.lang)].subject(String(d.code ?? '')),
  displayName: 'Sign-in code',
  previewData: { code: '482913', lang: 'en' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '480px' }
const h1 = { fontSize: '20px', color: '#1b4332', margin: '0 0 20px' }
const text = { fontSize: '15px', lineHeight: '1.5', color: '#1b2b24' }
const codeStyle = { fontSize: '32px', fontWeight: 700, letterSpacing: '6px', color: '#1b4332', margin: '16px 0' }
