import useTemplate from '../../shared/helpers/js/useTemplate';

export class CompanyTagListControl {
	JS_COMPANY_ACTIVE_CLASS: string = 'js-company-active';

	block: HTMLElement;
	companyTagList: HTMLElement | null;
	companyTagArr: HTMLElement[];

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;

		this.companyTagList = this.block.querySelector(`${blockClass}__companies-list`);
		this.companyTagArr = Array.from(this.block.querySelectorAll(`${blockClass}__company-tag`));

		this.#init();
	}

	get getCompanyTagArr() {
		return this.companyTagArr;
	}

	#init() {
		this.#bindCompanyTag();
	}

	#bindCompanyTag(companyTag?: HTMLElement) {
		if (companyTag) {
			companyTag.addEventListener('click', () => {
				if (!this.companyTagArr) return;
				for (let i = 0; i < this.companyTagArr?.length; i++) {
					this.companyTagArr[i].classList.remove(this.JS_COMPANY_ACTIVE_CLASS);
				}
				companyTag.classList.add(this.JS_COMPANY_ACTIVE_CLASS);
			});
		} else {
			this.companyTagArr?.forEach((companyTag) => {
				companyTag.addEventListener('click', () => {
					if (!this.companyTagArr) return;
					for (let i = 0; i < this.companyTagArr?.length; i++) {
						this.companyTagArr[i].classList.remove(this.JS_COMPANY_ACTIVE_CLASS);
					}
					companyTag.classList.add(this.JS_COMPANY_ACTIVE_CLASS);
				});
			});
		}
	}

	addCompanyTag(data: { companyId: string; companyName: string; companyLink: string }) {
		if (!this.companyTagList) return;
		const companyTagTemplate = useTemplate('template-company-tag', this.companyTagList);
		const newCompanyTag: HTMLLinkElement = companyTagTemplate.querySelector(
			'.company-tag-list__company-tag'
		) as HTMLLinkElement;

		newCompanyTag.setAttribute('data-company-id', data.companyId);
		newCompanyTag.href = data.companyLink;
		newCompanyTag.textContent = data.companyName;

		this.#bindCompanyTag(newCompanyTag);
		this.companyTagArr.push(newCompanyTag);
		this.companyTagList.append(newCompanyTag);

		return newCompanyTag;
	}

	removeCompanyTag(companyId: string) {
		for (let i = 0; i < this.companyTagArr.length; i++) {
			if (this.companyTagArr[i].getAttribute('data-company-id') === companyId) {
				this.companyTagArr[i].remove();
				this.companyTagArr.splice(this.companyTagArr.indexOf(this.companyTagArr[i]), 1);
				i--;
			}
		}
	}
}

export function CompanyTagList(block: HTMLElement) {
	const blockClass = '.company-tag-list';
	const element: HTMLElement | null = block.querySelector(blockClass);

	if (!element) {
		throw Error('Element not found');
	}
	return new CompanyTagListControl(element, blockClass);
}
