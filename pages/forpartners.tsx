import Head from 'next/head'
import Layout from '../components/layout'
import slug from 'rehype-slug'
import fs from 'fs'
import path from 'path'
import { serialize } from "next-mdx-remote/serialize";
import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import imageSize from "rehype-img-size";

export default function About(props) {
    return (
        <Layout>
            <Head>
                <title>For LayerSwap Partners</title>
            </Head>

            <main>
                <div className="flex justify-center">
                    <div className="py-4 px-8 md:px-0 prose md:prose-xl text-blueGray-300">
                        <MDXRemote {...props.mdxSource} />
                    </div>
                </div>
            </main>

        </Layout>
    )
}

export async function getStaticProps() {
    const markdown = fs.readFileSync(path.join(process.cwd(), 'public/doc/forPartners.md'), 'utf-8');
    const mdxSource = await serialize(markdown, {
        mdxOptions: {
            rehypePlugins: [slug, [imageSize, { dir: "public" }]],
        },
    });

    return {
        props: {
            mdxSource
        },
    }
}