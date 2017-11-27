import dcopy from 'deep-copy';

export const defaultActionSet = {
  'SetGlobalVariables': null,
  'PlaySounds': [{
    SoundType: 0,
    Val: ''
  }],
  'InitializeActorDialog': '',
  'SetZone': '',
  'ResetGame': false
};

export const defaultDialog = {
  'IsRoot': true,
  'EntryInput': [''],
  'AlwaysExec': dcopy(defaultActionSet),
  'ChildDialogIDs': [],
  'ParentDialogIDs': []
};

export const defaultZone = {
  'Title': '',
  'Triggers': {}
};

export class SelectedEntity {
  constructor({ kind, data } = {}) {
    this.kind = kind;
    this._data = data;
  }

  get data() {
    return this._data;
  }
}
