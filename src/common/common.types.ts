export type PartialFields<T extends Record<string, unknown>, F extends keyof T> = Omit<T, F> & Partial<Pick<T, F>>;

export enum MimeTypeCategory {
	Application = 'application',
	Audio = 'audio',
	Example = 'example',
	Image = 'image',
	Message = 'message',
	Model = 'model',
	Multipart = 'multipart',
	Text = 'text',
	Video = 'video'
}
