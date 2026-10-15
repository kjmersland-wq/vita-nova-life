import * as React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Text, Hr } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props { name?: string; email?: string; message?: string }

const ContactMessage = ({ name = '', email = '', message = '' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New message from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New contact message</Heading>
        <Text style={text}><strong>Name:</strong> {name}</Text>
        <Text style={text}><strong>E-mail:</strong> {email}</Text>
        <Hr />
        <Text style={{ ...text, whiteSpace: 'pre-wrap' }}>{message}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactMessage,
  subject: (d: Record<string, any>) => `Contact form: ${String(d['name'] ?? 'visitor').slice(0, 80)}`,
  displayName: 'Contact form message',
  to: 'support@vitanovalife.com',
  previewData: { name: 'Jane', email: 'jane@example.com', message: 'Hello!' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '20px', color: '#1b4332' }
const text = { fontSize: '15px', lineHeight: '1.5', color: '#1b2b24' }
