{ config, lib, pkgs, ... }:

let
  cfg = config.services.Oxy Pdf;
in
{
  options.services.Oxy Pdf = {
    enable = lib.mkEnableOption "Oxy Pdf - Professional PDF Tools";

    package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.Oxy Pdf;
      defaultText = lib.literalExpression "pkgs.Oxy Pdf";
      description = "The Oxy Pdf package to use.";
    };

    port = lib.mkOption {
      type = lib.types.port;
      default = 3000;
      description = "Port to listen on.";
    };

    openFirewall = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = "Whether to open the firewall port.";
    };
  };

  config = lib.mkIf cfg.enable {
    nixpkgs.overlays = [
      (final: prev: {
        Oxy Pdf = final.callPackage ./package.nix { };
      })
    ];

    systemd.services.Oxy Pdf = {
      description = "Oxy Pdf PDF Tools";
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      environment = {
        Oxy Pdf_PORT = toString cfg.port;
      };

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/Oxy Pdf";
        Restart = "on-failure";
        DynamicUser = true;
        RuntimeDirectory = "Oxy Pdf";
        StateDirectory = "Oxy Pdf";

        # Hardening
        NoNewPrivileges = true;
        ProtectSystem = "strict";
        ProtectHome = true;
        PrivateTmp = true;
        PrivateDevices = true;
        ProtectKernelTunables = true;
        ProtectKernelModules = true;
        ProtectControlGroups = true;
        RestrictSUIDSGID = true;
        MemoryDenyWriteExecute = false;
      };
    };

    networking.firewall.allowedTCPPorts = lib.mkIf cfg.openFirewall [ cfg.port ];
  };
}
