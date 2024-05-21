import { CompanyTagList, CompanyTagListControl } from '../../components/CompanyTagList/CompanyTagList';
import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';
import { IModalChangeData, ModalChangeDataControl } from '../ModalChangeData/ModalChangeData';
import {
	IModalDeleteConfirmation,
	ModalDeleteConfirmationControl,
} from '../ModalDeleteConfirmation/ModalDeleteConfirmation';

class CompanyInfoControl {
	block: HTMLElement;
	dataComponentId: string;
	dataCompanyId: string | null;
	companyAddButton: HTMLElement | null;
	companyInfoBlock: HTMLElement | null;
	companyTagList: CompanyTagListControl | null;
	modalChangeData: ModalChangeDataControl;
	modalDeleteConfirmation: ModalDeleteConfirmationControl;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;

		this.companyTagList = CompanyTagList(this.block);
		this.companyAddButton = this.block.querySelector(`${blockClass}__button-add-company`);
		this.companyInfoBlock = this.block.querySelector(`${blockClass}__about-company`);
		this.dataComponentId = this.companyInfoBlock?.getAttribute('data-component-id') || '';
		this.dataCompanyId = this.companyTagList.getCompanyTagArr[0]?.getAttribute('data-company-id') || null;

		this.modalChangeData = (document.querySelector('[data-modal="change-data"]') as IModalChangeData).modalChangeData;
		this.modalDeleteConfirmation = (
			document.querySelector('[data-modal="delete-confirmation"]') as IModalDeleteConfirmation
		).modalDeleteConfirmation;

		this.#init();
	}

	#init() {
		this.#bindCompanyTag();
		this.#bindModalsCompanyId();
		this.#addListener();
		this.#addMobileAdaptation();
	}

	#bindCompanyTag(companyTag?: HTMLElement) {
		if (companyTag) {
			companyTag.addEventListener('click', (e: Event) => {
				e.preventDefault();

				this.dataCompanyId = companyTag?.getAttribute('data-company-id');
				const url: string | null = companyTag.getAttribute('href');
				url && this.#apiFetch(url);
			});
		} else {
			const handler = (companyTag: HTMLLinkElement, e: Event) => {
				e.preventDefault();

				this.dataCompanyId = companyTag?.getAttribute('data-company-id');
				const url: string | null = companyTag.getAttribute('href');
				url && this.#apiFetch(url);
			};

			this.companyTagList?.getCompanyTagArr?.forEach((companyTag: HTMLElement) => {
				companyTag.addEventListener('click', handler.bind(this, companyTag as HTMLLinkElement));
			});
		}
	}

	#bindModalsCompanyId() {
		if (this.dataCompanyId) {
			this.modalChangeData.companyId = this.dataCompanyId;
			this.modalDeleteConfirmation.companyId = this.dataCompanyId;
		}
	}

	#apiFetch(url: string) {
		fetch(url, {
			method: 'GET',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'X-Component': this.dataComponentId,
			},
		})
			.then((response) => response.text())
			.then((data) => {
				if (data) {
					this.companyInfoBlock && (this.companyInfoBlock.innerHTML = data);

					this.modalChangeData.rebindModalChangeDataButtons();
					this.modalDeleteConfirmation.rebindModalDeleteConfirmationButtons();

					this.#bindModalsCompanyId();
				}
			});
	}

	#addListener() {
		// eslint-disable-next-line
		// @ts-ignore
		this.block.addEventListener('addCompanyEvent', (e: CustomEvent) => {
			this.companyTagList?.block.classList.remove('d-none');
			this.#bindCompanyTag(this.companyTagList?.addCompanyTag(e.detail));
		});

		// eslint-disable-next-line
		// @ts-ignore
		this.block.addEventListener('deleteCompanyEvent', (e: CustomEvent) => {
			e.detail.companyId && this.#deleteCompany(e.detail.companyId);
		});
	}

	#addMobileAdaptation() {
		useMediaQuery(
			1280,
			() => {},
			() => {
				this.companyAddButton && document.querySelector('.right-col')?.append(this.companyAddButton);
			}
		);
	}

	#deleteCompany(companyId: string) {
		this.companyTagList?.removeCompanyTag(companyId);
		if (this.companyTagList?.getCompanyTagArr && this.companyTagList?.getCompanyTagArr.length > 0) {
			this.companyTagList?.getCompanyTagArr[0].dispatchEvent(new Event('click'));
		} else {
			this.companyTagList?.block.classList.add('d-none');
			this.companyInfoBlock && (this.companyInfoBlock.innerHTML = '');
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass = '.company-info';
	const element: HTMLElement | null = document.querySelector(blockClass);

	element && new CompanyInfoControl(element, blockClass);
});
