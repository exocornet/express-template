export default function useTemplate(dataTemplate: string, blockElem?: HTMLElement) {
	let TEMPLATE: HTMLTemplateElement | null = null;
	if (blockElem) {
		TEMPLATE = blockElem.querySelector(`[data-template=${dataTemplate}]`);
	} else {
		TEMPLATE = document.querySelector(`[data-template=${dataTemplate}]`);
	}

	return TEMPLATE?.content.cloneNode(true) as HTMLElement;
}
