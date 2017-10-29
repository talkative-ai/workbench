export default {
  state() {
    return {
      'IsRoot': true,
      'EntryInput': [''],
      'AlwaysExec': {
        'SetGlobalVariables': null,
        'PlaySounds': [{
          SoundType: 0,
          Val: ''
        }],
        'InitializeActorDialog': 0,
        'SetZone': 0,
        'ResetGame': false
      },
      'ChildDialogIDs': [],
      'ParentDialogIDs': []
    };
  }
};
