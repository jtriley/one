define(function(require) {
  var Sunstone = require('sunstone');
  var Notifier = require('utils/notifier');
  var Locale = require('utils/locale');
  var OpenNebulaVM = require('opennebula/vm');
  var CommonActions = require('utils/common-actions');
  var Vnc = require('utils/vnc');
  var Spice = require('utils/spice');

  var TAB_ID = require('./tabId');
  var CREATE_DIALOG_ID = require('./form-panels/create/formPanelId');
  var DEPLOY_DIALOG_ID = require('./dialogs/deploy/dialogId');
  var MIGRATE_DIALOG_ID = require('./dialogs/migrate/dialogId');
  var VNC_DIALOG_ID = require('./dialogs/vnc/dialogId');
  var SPICE_DIALOG_ID = require('./dialogs/spice/dialogId');

  var XML_ROOT = "VM";
  var RESOURCE = "VM";

  var _commonActions = new CommonActions(OpenNebulaVM, RESOURCE, TAB_ID);

  var _actions = {
    "VM.list":    _commonActions.list(),
    "VM.show":    _commonActions.show(),
    "VM.refresh": _commonActions.refresh(),
    "VM.delete":  _commonActions.delete(),
    "VM.chown": _commonActions.multipleAction('chown'),
    "VM.chgrp": _commonActions.multipleAction('chgrp'),

    "VM.hold":    _commonActions.multipleAction('hold'),
    "VM.release": _commonActions.multipleAction('release'),
    "VM.suspend": _commonActions.multipleAction('suspend'),
    "VM.resume": _commonActions.multipleAction('resume'),
    "VM.stop": _commonActions.multipleAction('stop'),
    "VM.reboot_hard": _commonActions.multipleAction('reset'),
    "VM.delete_recreate": _commonActions.multipleAction('resubmit'),
    "VM.reboot": _commonActions.multipleAction('reboot'),
    "VM.poweroff": _commonActions.multipleAction('poweroff'),
    "VM.poweroff_hard": _commonActions.multipleAction('poweroff_hard'),
    "VM.undeploy": _commonActions.multipleAction('undeploy'),
    "VM.undeploy_hard": _commonActions.multipleAction('undeploy_hard'),
    "VM.shutdown": _commonActions.multipleAction('shutdown'),
    "VM.shutdown_hard": _commonActions.multipleAction('shutdown_hard'),
    "VM.recover": _commonActions.multipleAction('recover'),
    "VM.resched": _commonActions.multipleAction('resched'),
    "VM.unresched": _commonActions.multipleAction('unresched'),

    "VM.chmod": _commonActions.singleAction('chmod'),
    "VM.rename": _commonActions.singleAction('rename'),
    "VM.update_template": _commonActions.singleAction('update'),
    "VM.deploy_action": _commonActions.singleAction('deploy'),
    "VM.migrate_action": _commonActions.singleAction('migrate'),
    "VM.migrate_live_action": _commonActions.singleAction('livemigrate'),
    "VM.attachdisk": _commonActions.singleAction('attachdisk'),
    "VM.detachdisk": _commonActions.singleAction('detachdisk'),
    "VM.attachnic": _commonActions.singleAction('attachnic'),
    "VM.detachnic": _commonActions.singleAction('detachnic'),
    "VM.resize": _commonActions.singleAction('resize'),
    "VM.snapshot_create": _commonActions.singleAction('snapshot_create'),
    "VM.snapshot_revert": _commonActions.singleAction('snapshot_revert'),
    "VM.snapshot_delete": _commonActions.singleAction('snapshot_delete'),
    "VM.disk_snapshot_create": _commonActions.singleAction('disk_snapshot_create'),
    "VM.disk_snapshot_revert": _commonActions.singleAction('disk_snapshot_revert'),
    "VM.disk_snapshot_delete": _commonActions.singleAction('disk_snapshot_delete'),
    "VM.disk_saveas" : _commonActions.singleAction('disk_saveas'),

    "VM.create_dialog" : {
      type: "custom",
      call: function() {
        Sunstone.showFormPanel(TAB_ID, CREATE_DIALOG_ID, "create");
      }
    },
    "VM.create" : {
      type: "custom",
      call: function(id, name) {
        Sunstone.runAction("Template.instantiate", [id], name);
        Sunstone.runAction("VM.refresh");
      },
      callback: function(request, response) {
        Sunstone.getDataTable(TAB_ID).addElement(request, response);
      },
      error: Notifier.onError
    },
    "VM.deploy" : {
      type: "custom",
      call: function() {
        Sunstone.getDialog(DEPLOY_DIALOG_ID).show();
      }
    },
    "VM.silent_deploy_action" : {
      type: "single",
      call: OpenNebulaVM.deploy,
      error: Notifier.onError
    },
    "VM.migrate" : {
      type: "custom",
      call: function() {
       var dialog = Sunstone.getDialog(MIGRATE_DIALOG_ID);
       dialog.setLive(false);
       dialog.show();
     }
    },
    "VM.migrate_live" : {
      type: "custom",
      call: function() {
       var dialog = Sunstone.getDialog(MIGRATE_DIALOG_ID);
       dialog.setLive(true);
       dialog.show();
     }
    },
    "VM.startvnc" : {
      type: "custom",
      call: function() {
        $.each(Sunstone.getDataTable(TAB_ID).elements(), function(index, elem) {
          if (!Vnc.lockStatus()) {
            Vnc.lock();
            Sunstone.runAction("VM.startvnc_action", elem);
          } else {
            Notifier.notifyError(Locale.tr("VNC Connection in progress"))
            return false;
          }
        });
      }
    },
    "VM.startvnc_action" : {
      type: "single",
      call: OpenNebulaVM.vnc,
      callback: function(request, response) {
       var dialog = Sunstone.getDialog(VNC_DIALOG_ID);
       dialog.setElement(response);
       dialog.show();
      },
      error: function(req, resp) {
        Notifier.onError(req, resp);
        Vnc.unlock();
      },
      notify: true
    },
    "VM.startspice" : {
      type: "custom",
      call: function() {
        $.each(Sunstone.getDataTable(TAB_ID).elements(), function(index, elem) {
          if (!Spice.lockStatus()) {
            Spice.lock();
            Sunstone.runAction("VM.startspice_action", elem);
          } else {
            Notifier.notifyError(Locale.tr("SPICE Connection in progress"))
            return false;
          }
        });
      }
    },
    "VM.startspice_action" : {
      type: "single",
      call: OpenNebulaVM.vnc,
      callback: function(request, response) {
       var dialog = Sunstone.getDialog(SPICE_DIALOG_ID);
       dialog.setElement(response);
       dialog.show();
      },
      error: function(req, resp) {
        Notifier.onError(req, resp);
        Spice.unlock();
      },
      notify: true
    }
  };

  return _actions;
});
