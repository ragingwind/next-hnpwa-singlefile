import Head from 'next/head'
import Link from "next/link";
import 'isomorphic-unfetch'

const log = (...args) => console.log('%csw', 'background-color:black; color:white; padding: 2px 0.5em; border-radius: 0.5em;', ...args)

export default class extends React.PureComponent {
	static async getInitialProps ({query, pathname}) {
		const res = await fetch(`https://hnpwa.com/api/v0/${query.feed || 'news' }.json`)
		return {feeds: await res.json()}
	}

	componentDidMount () {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/static/workbox/sw.js', {scope: '../../'})
				.then(reg => log('service worker registration succeed', reg))
				.catch(err => log('service worker registration failed', err.message))
		}
	}

	render () {
		return (
			<div>
				<Head>
					<title>NEXT-PWA</title>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					<link rel="manifest" href="/static/manifest/manifest.json" />
				</Head>
				<header>
					<nav>
						<Link href='/'><a>News</a></Link>
						<Link href='/?feed=newest'><a>Newest</a></Link>
						<Link href='/?feed=ask'><a>Ask</a></Link>
						<Link href='/?feed=show'><a>Show</a></Link>
						<Link href='/?feed=jobs'><a>Jobs</a></Link>
					</nav>
				</header>
				<div>
					<ul>
						{this.props.feeds.map(f => <li key={f.id}>{f.title}</li>)}
					</ul>
				</div>
			</div>
		)
	}
}