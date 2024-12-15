import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { parseRelativeDate } from '@/utils/parse-date';
import { load } from 'cheerio';

export const route: Route = {
    path: '/new',
    categories: ['blog'],
    example: '/cyberbus/new',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['cyberbus.net/'],
        },
    ],
    name: 'CyberBus 最新帖子',
    maintainers: ['Ray-D-Song'],
    handler,
};

async function handler() {
    const baseUrl = 'https://cyberbus.net';
    const newPostUrl = `${baseUrl}?dataType=Post&listingType=Local&sort=New`;

    const response = await ofetch(newPostUrl);
    const $ = load(response);

    const list = $('.post-listing')
        .toArray()
        .map((item) => {
            const title = $(item).find('.post-title').find('h1').text();
            const link = $(item).find(String.raw`.text-neutral-content.visited\:text-neutral-content-weak`).attr('href');
            const pubDate = parseRelativeDate($(item).find('.moment-time.pointer.unselectable').text());

            const mainContent = $(item).find('article');
            const description = mainContent.find('p').text();
            const image = mainContent.find('img').attr('src');

            return {
                title,
                link,
                pubDate,
                description,
                image,
            };
        });

    return {
        title: 'CyberBus - 最新帖子',
        link: baseUrl,
        description: 'CyberBus 最新发布的帖子',
        item: list,
    };
}
