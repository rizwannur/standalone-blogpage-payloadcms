import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  user: string
  password: string
  fromEmail: string
  fromName: string
}

interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

class EmailService {
  private transporter: Transporter | null = null
  private config: EmailConfig | null = null

  /**
   * Initialize the email service with configuration
   */
  async initialize(config: EmailConfig): Promise<void> {
    this.config = config

    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465, // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.password,
      },
    })

    // Verify connection
    try {
      if (this.transporter) {
        await this.transporter.verify()
        console.log('Email service initialized successfully')
      }
    } catch (error) {
      console.error('Email service initialization failed:', error)
      throw error
    }
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.transporter || !this.config) {
      throw new Error('Email service not initialized')
    }

    const mailOptions = {
      from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', info.messageId)
      return info
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  }

  /**
   * Send welcome email to new newsletter subscribers
   */
  async sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
    const subject = 'Welcome to our newsletter!'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome${firstName ? ` ${firstName}` : ''}!</h1>
        <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
        <p>You'll receive our latest blog posts, updates, and exclusive content directly in your inbox.</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br>The Blog Team</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          If you didn't subscribe to this newsletter, you can 
          <a href="#" style="color: #666;">unsubscribe here</a>.
        </p>
      </div>
    `

    await this.sendEmail({
      to: email,
      subject,
      html,
    })
  }

  /**
   * Send email confirmation for newsletter subscription
   */
  async sendConfirmationEmail(
    email: string,
    confirmationToken: string,
    baseUrl: string,
  ): Promise<void> {
    const confirmationUrl = `${baseUrl}/newsletter/confirm?token=${confirmationToken}`
    const subject = 'Please confirm your newsletter subscription'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Confirm Your Subscription</h1>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>Please click the button below to confirm your email address and complete your subscription:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Confirm Subscription
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
        <p>This confirmation link will expire in 24 hours.</p>
        <p>If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
      </div>
    `

    await this.sendEmail({
      to: email,
      subject,
      html,
    })
  }

  /**
   * Send notification email to admin about new comment
   */
  async sendCommentNotification(
    adminEmail: string,
    postTitle: string,
    commentAuthor: string,
    commentContent: string,
    postUrl: string,
  ): Promise<void> {
    const subject = `New comment on "${postTitle}"`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Comment Notification</h1>
        <p>A new comment has been posted on your blog post:</p>
        <h2 style="color: #555;">"${postTitle}"</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Author:</strong> ${commentAuthor}</p>
          <p><strong>Comment:</strong></p>
          <p style="font-style: italic;">${commentContent}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${postUrl}" 
             style="background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Post
          </a>
        </div>
        <p>You can moderate this comment from your admin panel.</p>
      </div>
    `

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    })
  }

  /**
   * Send newsletter campaign to subscribers
   */
  async sendNewsletterCampaign(
    subscribers: string[],
    subject: string,
    content: string,
    unsubscribeUrl: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${content}
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          You received this email because you subscribed to our newsletter.<br>
          <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a> | 
          <a href="#" style="color: #666;">Update Preferences</a>
        </p>
      </div>
    `

    // Send emails in batches to avoid overwhelming the SMTP server
    const batchSize = 50
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)

      await Promise.all(
        batch.map((email) =>
          this.sendEmail({
            to: email,
            subject,
            html,
          }),
        ),
      )

      // Add delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  /**
   * Send search notification to admin about search queries
   */
  async sendSearchNotification(
    adminEmail: string,
    searchQuery: string,
    category: string,
    resultCount: number,
  ): Promise<void> {
    const subject =
      resultCount === 0
        ? `No results found for search: "${searchQuery}"`
        : `Popular search query: "${searchQuery}"`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Search Analytics Notification</h1>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Search Query:</strong> "${searchQuery}"</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Results Found:</strong> ${resultCount}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
        ${
          resultCount === 0
            ? `
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">Content Opportunity</h3>
            <p style="color: #856404;">This search returned no results. Consider creating content about this topic to improve user experience.</p>
          </div>
        `
            : `
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">Popular Search</h3>
            <p style="color: #155724;">This search query is generating interest. Consider creating more related content.</p>
          </div>
        `
        }
        <p>You can view detailed search analytics in your admin panel.</p>
      </div>
    `

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    })
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export types
export type { EmailConfig, EmailOptions }
