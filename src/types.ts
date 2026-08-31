export type FieldValue = string | boolean;

export type FormSnapshot = Record<string, FieldValue>;

export type ModalSnapshots = Record<string, FormSnapshot>;

export type SavedData = Record<string, ModalSnapshots>;

export type ExtensionMessage =
  | {
      type: "SAVE_FIELD_CHANGE";
      payload: {
        url: string;
        modalName: string;
        fieldId: string;
        value: FieldValue;
      };
    }
  | {
      type: "GET_PAGE_DATA";
      payload: {
        url: string;
      };
    }
  | {
      type: "START_RESTORE";
      payload: {
        data: ModalSnapshots;
      };
    }
  | {
      type: "CANCEL_RESTORE";
    };
