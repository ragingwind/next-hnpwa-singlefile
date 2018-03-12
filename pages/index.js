import Head from 'next/head'
import Link from "next/link";

export default () => (
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
	</div>
)