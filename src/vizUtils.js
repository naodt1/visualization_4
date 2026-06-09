import * as d3 from 'd3';

export const PLACEHOLDER_MSG = "Click a cluster node on the dendrogram to view insights.";
export const VIZ_HEIGHT = 380;
export const FALLBACK_WIDTH = 480;

export function containerWidth(selector) {
    const node = d3.select(selector).node();
    return node?.clientWidth > 0 ? node.clientWidth : FALLBACK_WIDTH;
}

export function showPlaceholder(containerSelector, message = PLACEHOLDER_MSG) {
    d3.select(containerSelector).html(
        `<div class="viz-placeholder">${message}</div>`
    );
}
