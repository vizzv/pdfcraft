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
  };

  config = lib.mkIf cfg.enable {
    nixpkgs.overlays = [
      (final: prev: {
        Oxy Pdf = final.callPackage ./package.nix { };
      })
    ];

    systemd.user.services.Oxy Pdf = {
      Unit = {
        Description = "Oxy Pdf PDF Tools";
        After = [ "network.target" ];
      };

      Service = {
        ExecStart = "${cfg.package}/bin/Oxy Pdf";
        Restart = "on-failure";
        Environment = [
          "Oxy Pdf_PORT=${toString cfg.port}"
        ];
      };

      Install = {
        WantedBy = [ "default.target" ];
      };
    };
  };
}
