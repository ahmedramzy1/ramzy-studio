import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useLocation, useParams } from "react-router-dom";
import {
  activeHistoryIdAtom,
  historyAtoms,
} from "@/features/page-history/atoms/history-atoms";
import { fetchPageHistory } from "@/features/page-history/queries/page-history-query";
import { IPageHistory } from "@/features/page-history/types/page.types";
import {
  pageEditorAtom,
  titleEditorAtom,
} from "@/features/editor/atoms/editor-atoms";
import { useSpaceAbility } from "@/features/space/permissions/use-space-ability";
import { useSpaceQuery } from "@/features/space/queries/space-query";
import {
  SpaceCaslAction,
  SpaceCaslSubject,
} from "@/features/space/permissions/permissions.type";

export function useHistoryRestore() {
  const { t } = useTranslation();

  const activeHistoryId = useAtomValue(activeHistoryIdAtom);
  const mainEditor = useAtomValue(pageEditorAtom);
  const mainEditorTitle = useAtomValue(titleEditorAtom);
  const setHistoryModalOpen = useSetAtom(historyAtoms);

  const location = useLocation();
  const { spaceSlug } = useParams();
  const { data: space } = useSpaceQuery(spaceSlug);
  const spaceAbility = useSpaceAbility(space?.membership?.permissions);
  const isPortfolioAuthoring = location.pathname.includes("/portfolio/edit/");

  // Portfolio authoring intentionally omits Docmost's title editor because the
  // portfolio project title lives in website metadata. In that surface the
  // live body editor's editability is the relevant restore permission gate.
  const canRestore = isPortfolioAuthoring
    ? Boolean(mainEditor && !mainEditor.isDestroyed && mainEditor.isEditable)
    : spaceAbility.can(SpaceCaslAction.Manage, SpaceCaslSubject.Page);

  const handleRestore = useCallback(
    async (historyId: string) => {
      let historyData: IPageHistory;
      try {
        historyData = await fetchPageHistory(historyId);
      } catch {
        notifications.show({
          message: t("Error fetching page data."),
          color: "red",
        });
        return;
      }

      if (!mainEditor || mainEditor.isDestroyed) {
        return;
      }

      // Normal Docmost pages restore both title and body. Portfolio Build only
      // restores the Studio-owned case-study body; Sanity owns project title
      // and metadata outside this editor.
      if (!isPortfolioAuthoring) {
        if (!mainEditorTitle || mainEditorTitle.isDestroyed) {
          return;
        }

        mainEditorTitle
          .chain()
          .clearContent()
          .setContent(historyData.title, { emitUpdate: true })
          .run();
      }

      mainEditor
        .chain()
        .clearContent()
        .setContent(historyData.content)
        .run();

      setHistoryModalOpen(false);
      notifications.show({ message: t("Successfully restored") });
    },
    [
      isPortfolioAuthoring,
      mainEditor,
      mainEditorTitle,
      setHistoryModalOpen,
      t,
    ],
  );

  const confirmRestore = useCallback(
    (historyId?: string) => {
      const targetId = historyId ?? activeHistoryId;
      if (!targetId) return;

      modals.openConfirmModal({
        title: t("Please confirm your action"),
        children: (
          <Text size="sm">
            {t(
              "Are you sure you want to restore this version? Any changes not versioned will be lost.",
            )}
          </Text>
        ),
        labels: { confirm: t("Confirm"), cancel: t("Cancel") },
        onConfirm: () => handleRestore(targetId),
      });
    },
    [t, handleRestore, activeHistoryId],
  );

  return { canRestore, confirmRestore };
}
