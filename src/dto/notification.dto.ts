export interface notificationDTO {
  to: string,            // Email of the recipient
  subject: string,      // subject of the mail
  templateId: string,   // Id of the email template to be used
  params: Record<string , any>  // Parameter to replace the template
}