# Upstream inventory and attribution

Compared against deeplethe/solid-glass main at 6e8903e494a15491ceda38fafea5056c95a74d44 (the current upstream main at the time of this work).

- 75 upstream UI component source files: all retained.
- 456 upstream example files: all retained.
- 59 upstream block files: all retained.

The fork already contained this code; it did not need to be copied over our changes again. The new full collection at `/components` makes all UI source files discoverable and installable from this fork. The homepage keeps the shorter 12-example introduction.

## Original Colorwork additions

Tone Badge, Color Surface, Palette Picker, Option Card, Status Callout and Copy Snippet are the six original component additions. They use the shared color roles. The Button is labeled an adaptation; its foundation is inherited, with a Kumo-informed finish. Inherited entries retain Solid Glass or shadcn/ui provenance.

The full catalog and registry are derived from actual UI files. Local UI dependencies resolve to this fork, pinned to color-language; sidebar's mobile hook is included with its source. Complete block files remain in the existing Blocks browser.

The original MIT LICENSE, NOTICE.md and upstream history remain. Inclusion is not a claim that every component or example has been individually redesigned or audited.
