# Ramzy Studio project knowledge protocol

Ramzy Studio is the structured authoring and rendering engine integrated into `ahmedramzy.com`. The canonical cross-repository knowledge hub lives in the sibling website repository.

Before any project task, read these files completely when the repositories are checked out as siblings:

1. `../ahmedramzy.com/docs/knowledge-base/00-start-here.md`
2. `../ahmedramzy.com/docs/knowledge-base/11-current-state.md`
3. `../ahmedramzy.com/docs/knowledge-base/13-agent-playbook.md`
4. the relevant chapter(s) linked from `../ahmedramzy.com/docs/knowledge-base/README.md`

If the sibling repository is unavailable, read the same files from the active `ramzy/post-integration-ux` branch of <https://github.com/ahmedramzy1/ahmedramzy.com/tree/ramzy/post-integration-ux/docs/knowledge-base>.

Verify this repository's remote feature-branch head before acting. For runtime-affecting source changes, preserve and record the exact Studio source → `portfolio-runtime-dist` artifact → website dependency pin chain. Documentation-only changes do not require a runtime rebuild.

Keep Studio PR #20 draft/open/unmerged unless explicitly instructed otherwise. Do not deploy without explicit instruction. Update the canonical website hub—especially `11-current-state.md`—before closing substantial cross-repository work.

