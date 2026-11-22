"use client";

import { useState } from "react";
import { Accessibility, CheckCircle2, Eye, ListChecks, RotateCcw, ShieldAlert } from "lucide-react";
import type { LabSessionState } from "@/lib/science-adapters";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";
import type { ExperimentDefinition, LabMode, Locale, Quantity } from "@/lib/types";

export interface DispatchActionArgs {
  targetObjectId: string;
  actionType: string;
  parametersWithUnits?: Record<string, Quantity>;
  interactionPort?: string;
  choiceId?: string;
}

interface LabStageCanvasProps {
  definition: ExperimentDefinition;
  mode: LabMode;
  locale: Locale;
  state: LabSessionState;
  disabled: boolean;
  onDispatch: (args: DispatchActionArgs) => Promise<void>;
}

export function LabStageCanvas({
  definition,
  mode,
  locale,
  state,
  disabled,
  onDispatch,
}: LabStageCanvasProps) {
  const dict = getDictionary(locale);
  const copy = getExperimentCopy(definition.experimentId, locale);
  const [showEquipmentDrawer, setShowEquipmentDrawer] = useState(false);
  const [domAccessibleMode, setDomAccessibleMode] = useState(false);
  const [viewZoom, setViewZoom] = useState(1);

  const subject = definition.subject;

  // Discrete keyboard/screen-reader actions that call the EXACT same API action executor as pointer hotspots
  const equipmentActions: Array<{
    id: string;
    label: string;
    detail: string;
    dangerGuard?: boolean;
    args: DispatchActionArgs;
  }> =
    subject === "chemistry"
      ? [
          {
            id: "connect-soap",
            label: "Connect delivery tube → soap-solution receiver (port_soap_receiver)",
            detail: "Valid Activity 2.3 apparatus setup",
            args: {
              targetObjectId: "chem.transfer:1",
              actionType: "setup_apparatus",
              interactionPort: "port_soap_receiver",
            },
          },
          {
            id: "identify-zn",
            label: "Verify reactant: Zinc granules (Zn)",
            detail: "Admitted Activity 2.3 solid metal",
            args: {
              targetObjectId: "chem.reaction-tube:1",
              actionType: "identify_reagent",
              choiceId: "Zn",
            },
          },
          {
            id: "identify-h2so4",
            label: "Verify reactant: Dilute sulfuric acid (dilute_H2SO4)",
            detail: "Admitted Activity 2.3 acid reagent",
            args: {
              targetObjectId: "chem.reaction-tube:1",
              actionType: "identify_reagent",
              choiceId: "dilute_H2SO4",
            },
          },
          {
            id: "run-default-bound",
            label: "Run bounded stoichiometry fixture (2.0 µmol Zn + 3.0 µmol H⁺ eq)",
            detail: "Computes theoretical upper bound 1.5 µmol H₂",
            args: {
              targetObjectId: "chem.reaction-tube:1",
              actionType: "propose_virtual_amount",
              parametersWithUnits: {
                zincAmount: { value: state.zincUmol ?? 2.0, unit: "umol" },
                acidEquivalent: { value: state.acidEqUmol ?? 3.0, unit: "umol" },
              },
            },
          },
          {
            id: "guard-bad-port",
            label: "Test safety guard: Connect tube to open air (expect 422 BAD_PORT)",
            detail: "Verifies invalid port is rejected without changing revision",
            dangerGuard: true,
            args: {
              targetObjectId: "chem.transfer:1",
              actionType: "setup_apparatus",
              interactionPort: "port_open_air",
            },
          },
          {
            id: "guard-bad-reagent",
            label: "Test safety guard: Substitute HCl (expect 422 INCOMPATIBLE_MATERIAL)",
            detail: "Verifies unsupported acids are blocked with zero mutation",
            dangerGuard: true,
            args: {
              targetObjectId: "chem.reaction-tube:1",
              actionType: "identify_reagent",
              choiceId: "HCl",
            },
          },
        ]
      : subject === "physics"
        ? [
            {
              id: "mount-slab",
              label: "Mount parallel glass slab aligned to normal (port_parallel_normal)",
              detail: "Valid Activity 9.10 optical alignment",
              args: {
                targetObjectId: "phys.glass-slab:1",
                actionType: "place_optic",
                interactionPort: "port_parallel_normal",
              },
            },
            {
              id: "trace-45",
              label: "Trace incident ray at 45° through 20 mm slab",
              detail: "Theoretical Snell trace (r = 28.13°, offset = 6.58 mm)",
              args: {
                targetObjectId: "phys.glass-slab:1",
                actionType: "select_incident_ray",
                parametersWithUnits: {
                  angle: { value: state.incidentAngleDeg ?? 45, unit: "deg" },
                  slabThickness: { value: state.slabThicknessMm ?? 20, unit: "mm" },
                },
              },
            },
            {
              id: "trace-30",
              label: "Trace comparison ray at 30° through 20 mm slab",
              detail: "Comparison angle within 0–60° domain",
              args: {
                targetObjectId: "phys.glass-slab:1",
                actionType: "select_incident_ray",
                parametersWithUnits: {
                  angle: { value: 30, unit: "deg" },
                  slabThickness: { value: state.slabThicknessMm ?? 20, unit: "mm" },
                },
              },
            },
            {
              id: "guard-angle-oob",
              label: "Test domain guard: Incident angle 75° (expect 422 OUTSIDE_DOMAIN)",
              detail: "Verifies out-of-range angle is rejected without mutation",
              dangerGuard: true,
              args: {
                targetObjectId: "phys.glass-slab:1",
                actionType: "select_incident_ray",
                parametersWithUnits: {
                  angle: { value: 75, unit: "deg" },
                  slabThickness: { value: 20, unit: "mm" },
                },
              },
            },
          ]
        : [
            {
              id: "select-field-1",
              label: "Load prepared onion epidermis slide — Field 1",
              detail: "Discrete acquired fixture field (qualitative view)",
              args: {
                targetObjectId: "bio.prepared-onion-slide:1",
                actionType: "select_field",
                parametersWithUnits: { fieldIndex: { value: 1, unit: "1" } },
              },
            },
            {
              id: "select-plane-1",
              label: "Focus microscope to acquired plane 1",
              detail: "Discrete focus index within 0–2 stack",
              args: {
                targetObjectId: "bio.compound-microscope:1",
                actionType: "select_acquired_plane",
                parametersWithUnits: { fixturePlaneIndex: { value: 1, unit: "1" } },
              },
            },
            {
              id: "mark-cell-wall",
              label: "Annotate visible plant cell wall boundary",
              detail: "Records confirmed qualitative morphology observation",
              args: {
                targetObjectId: "bio.image-view:1",
                actionType: "mark_visible_boundary",
                choiceId: "cell_wall",
              },
            },
            {
              id: "guard-uncalibrated",
              label: "Test calibration guard: Measure µm length (expect 422 CALIBRATION_MISSING)",
              detail: "Verifies quantitative length is blocked pending calibrated micrographs",
              dangerGuard: true,
              args: {
                targetObjectId: "bio.scale-overlay:1",
                actionType: "measure_cell_length",
                parametersWithUnits: { distance: { value: 100, unit: "px" } },
              },
            },
          ];

  return (
    <div className="g1-card flex h-full flex-col p-2.5">
      <div className="relative flex min-h-[380px] flex-1 flex-col overflow-hidden rounded-[18px] bg-[#e8f7fc] p-4 sm:min-h-[470px]">
        {/* Top stage badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <span className="g1-tag bg-white/95 text-[#23435e]">
            {domAccessibleMode ? dict.player.accessibleDomMode : dict.player.illustrativeView}
          </span>
          <span className="g1-tag bg-white/90 font-mono text-[11px] text-[#355670]">
            {definition.sceneId} · {mode === "simulation" ? "GUIDED" : "INQUIRY"}
          </span>
        </div>

        {/* Main stage area: either interactive visual concept canvas OR pure 2D accessible DOM controls */}
        {domAccessibleMode ? (
          <div
            tabIndex={0}
            aria-label="2D Accessible laboratory controls"
            className="relative z-10 my-4 flex-1 overflow-y-auto rounded-2xl border border-[#cde6f5] bg-white p-5"
          >
            <h3 className="text-base font-extrabold text-[#0c2444]">
              2D Accessible DOM Control Equivalent (WCAG 2.2 AA Parity)
            </h3>
            <p className="mt-1 text-xs text-[#4b637a]">
              Every action below submits the exact same typed server command and earns the exact
              same rubric credit as pointer interaction.
            </p>
            <div className="mt-4 space-y-2.5">
              {equipmentActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => void onDispatch(act.args)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-xs font-bold transition-colors ${
                    act.dangerGuard
                      ? "border-[#f3d1c9] bg-[#fff9f8] text-[#912018] hover:bg-[#fef3f2]"
                      : "border-[#cde3f2] bg-[#f7fbff] text-[#0c2444] hover:bg-[#e9f5ff]"
                  }`}
                  data-testid={`dom-action-${act.id}`}
                >
                  <div>
                    <div>{act.label}</div>
                    <div className="mt-0.5 font-normal text-[#4b637a]">{act.detail}</div>
                  </div>
                  <span className="shrink-0 text-[11px] font-extrabold text-[#007875]">Run →</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative flex flex-1 flex-col items-center justify-center py-4">
            <div
              className="relative flex w-full max-w-[680px] items-center justify-center transition-transform duration-150"
              style={{ transform: `scale(${viewZoom})` }}
            >
              {/* Approved concept SVG base */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={copy.imagePath}
                alt={`${copy.title} — apparatus diagram (illustrative concept, not to scale)`}
                className="max-h-[340px] w-full rounded-xl object-contain"
              />
            </div>

            {/* Live server-confirmed state badges overlaid below diagram — ONLY reflects accepted server state */}
            <div
              aria-live="polite"
              className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs"
            >
              {subject === "chemistry" && (
                <>
                  <span className={`g1-tag ${state.apparatusConnected ? "g1-tag-green" : "bg-white"}`}>
                    {state.apparatusConnected ? "✓ Delivery tube → soap solution connected" : "Delivery tube not yet connected"}
                  </span>
                  {state.theoreticalH2Umol !== null && state.theoreticalH2Umol !== undefined && (
                    <span className="g1-tag g1-tag-blue">
                      Confirmed H₂ upper bound: {state.theoreticalH2Umol} µmol (theoretical)
                    </span>
                  )}
                </>
              )}

              {subject === "physics" && (
                <>
                  <span className={`g1-tag ${state.slabMounted ? "g1-tag-green" : "bg-white"}`}>
                    {state.slabMounted ? "✓ Glass slab aligned to normal" : "Slab not yet mounted"}
                  </span>
                  {state.refractedAngleDeg !== null && state.refractedAngleDeg !== undefined && (
                    <span className="g1-tag g1-tag-blue">
                      i = {state.incidentAngleDeg}° · r = {state.refractedAngleDeg}° · offset = {state.transverseOffsetMm} mm
                    </span>
                  )}
                </>
              )}

              {subject === "biology" && (
                <>
                  <span className={`g1-tag ${state.slideLoaded ? "g1-tag-green" : "bg-white"}`}>
                    {state.slideLoaded
                      ? `✓ Field ${state.selectedField ?? 0} · Plane ${state.acquiredPlane ?? 0}`
                      : "Slide not yet selected"}
                  </span>
                  {state.annotatedStructures && state.annotatedStructures.length > 0 && (
                    <span className="g1-tag g1-tag-blue">
                      Marked: {state.annotatedStructures.join(", ")}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Accessible Equipment List slide-up panel */}
        {showEquipmentDrawer && !domAccessibleMode && (
          <div
            role="region"
            aria-label="Accessible equipment list"
            className="relative z-20 mb-3 max-h-[240px] overflow-y-auto rounded-2xl border border-[#b9d8ec] bg-white p-4 shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0c2444]">
                Equipment &amp; Guard Actions ({definition.requiredApparatus.length} items)
              </h3>
              <button
                type="button"
                onClick={() => setShowEquipmentDrawer(false)}
                className="text-xs font-bold text-[#007875] hover:underline"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {equipmentActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => void onDispatch(act.args)}
                  className={`flex items-start gap-2 rounded-xl border p-2.5 text-left text-xs font-semibold transition-colors ${
                    act.dangerGuard
                      ? "border-[#f3d1c9] bg-[#fff9f8] text-[#912018] hover:bg-[#fef3f2]"
                      : "border-[#d8e8f2] bg-[#f8fcff] text-[#0c2444] hover:bg-[#e8f5ff]"
                  }`}
                  data-testid={`equip-action-${act.id}`}
                >
                  {act.dangerGuard ? (
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#007875]" aria-hidden="true" />
                  )}
                  <span>{act.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom stage toolbar matching 06 & 07 references */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setViewZoom(1);
                setShowEquipmentDrawer(false);
              }}
              className="g1-btn g1-btn-outline min-h-[38px] px-3.5 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{dict.player.resetView}</span>
            </button>
            <button
              type="button"
              onClick={() => setDomAccessibleMode((v) => !v)}
              aria-pressed={domAccessibleMode}
              className="g1-btn g1-btn-outline min-h-[38px] px-3.5 text-xs"
              data-testid="toggle-dom-mode"
            >
              {domAccessibleMode ? (
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Accessibility className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>
                {domAccessibleMode ? dict.player.canvasViewMode : dict.player.accessibleDomMode}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setDomAccessibleMode(false);
              setShowEquipmentDrawer((v) => !v);
            }}
            aria-expanded={showEquipmentDrawer}
            className="g1-btn g1-btn-outline min-h-[38px] px-3.5 text-xs"
            data-testid="toggle-equipment-list"
          >
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{dict.player.equipmentList}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
