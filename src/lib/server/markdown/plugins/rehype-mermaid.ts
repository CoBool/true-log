import { visit } from 'unist-util-visit';

type HastNode = {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
	value?: string;
};

type HastParent = {
	children: HastNode[];
};

export function rehypeMermaid() {
	return (tree: HastNode) => {
		visit(tree, 'element', (node: HastNode, index, parent?: HastParent) => {
			if (node.tagName !== 'pre' || !parent || index === undefined) {
				return;
			}

			const codeChild = node.children?.find(
				(child): child is HastNode => child.type === 'element' && child.tagName === 'code'
			);

			if (!codeChild) {
				return;
			}

			const className = codeChild.properties?.className;
			const classes = Array.isArray(className) ? className : [className];
			const isMermaid = classes.some(
				(classValue) => typeof classValue === 'string' && classValue === 'language-mermaid'
			);

			if (!isMermaid) {
				return;
			}

			parent.children[index] = {
				type: 'element',
				tagName: 'pre',
				properties: { className: ['mermaid'] },
				children: [{ type: 'text', value: extractText(codeChild) }]
			};
		});
	};
}

function extractText(node: HastNode): string {
	return (
		node.children?.map((child) => {
			if (child.type === 'text') {
				return child.value ?? '';
			}

			if (child.type === 'element') {
				return extractText(child);
			}

			return '';
		}) ?? []
	).join('');
}
