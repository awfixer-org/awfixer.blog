interface SiteConfig {
	site: string
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	site: 'https://awfixer.blog',
	author: 'austin',
	title: "AWFixer's Blog",
	description: 'sometimes I wonder if I could have done it different.',
	lang: 'en-US',
	ogLocale: 'en_US',
	shareMessage: 'Share this post',
	paginationSize: 6
}
