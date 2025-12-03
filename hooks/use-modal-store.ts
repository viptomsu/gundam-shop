import { create } from "zustand";
import { ModalIds } from "@/types/modal";

export type ModalState = {
	id: string;
	isOpen: boolean;
	args?: any;
	component?: React.ComponentType<any>;
	resolve?: (value: any) => void;
	reject?: (reason: any) => void;
};

interface ModalStore {
	modals: Record<string, ModalState>;
	registry: Record<string, React.ComponentType<any>>;
	register: (id: ModalIds | string, comp: React.ComponentType<any>) => void;
	unregister: (id: ModalIds | string) => void;
	show: (
		id: ModalIds | string | React.ComponentType<any>,
		args?: any
	) => Promise<any>;
	hide: (id: ModalIds | string | React.ComponentType<any>) => void;
	remove: (id: ModalIds | string | React.ComponentType<any>) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
	modals: {},
	registry: {},

	register: (id, comp) =>
		set((state) => ({
			registry: { ...state.registry, [id]: comp },
		})),

	unregister: (id) =>
		set((state) => {
			const newRegistry = { ...state.registry };
			delete newRegistry[id];
			return { registry: newRegistry };
		}),

	show: (idOrComp, args) => {
		return new Promise((resolve, reject) => {
			const id =
				typeof idOrComp === "string"
					? idOrComp
					: (idOrComp as any).displayName || (idOrComp as any).name;

			set((state) => {
				const component =
					typeof idOrComp !== "string" ? idOrComp : state.registry[id];

				if (!component && typeof idOrComp === "string") {
					console.warn(`Modal with id "${id}" not found in registry.`);
				}

				return {
					modals: {
						...state.modals,
						[id]: {
							id,
							isOpen: true,
							args,
							component,
							resolve,
							reject,
						},
					},
				};
			});
		});
	},

	hide: (idOrComp) => {
		const id =
			typeof idOrComp === "string"
				? idOrComp
				: (idOrComp as any).displayName || (idOrComp as any).name;

		set((state) => {
			const modal = state.modals[id];
			if (!modal) return state;

			return {
				modals: {
					...state.modals,
					[id]: {
						...modal,
						isOpen: false,
					},
				},
			};
		});
	},

	remove: (idOrComp) => {
		const id =
			typeof idOrComp === "string"
				? idOrComp
				: (idOrComp as any).displayName || (idOrComp as any).name;

		set((state) => {
			const newModals = { ...state.modals };
			delete newModals[id];
			return { modals: newModals };
		});
	},
}));

export const useModal = (id: ModalIds | string) => {
	const { show, hide } = useModalStore();
	const isOpen = useModalStore((state) => state.modals[id]?.isOpen || false);
	const args = useModalStore((state) => state.modals[id]?.args);

	return {
		isOpen,
		args,
		show: (args?: any) => show(id, args),
		hide: () => hide(id),
	};
};
