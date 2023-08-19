/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Tab, TabList, TabPanel, Tabs } from "@app/components/v2";
import { OrgGeneralPermissionActions, OrgPermissionSubjects, useOrganization } from "@app/context";
import { withPermission } from "@app/hoc";
import { useGetRoles } from "@app/hooks/api";

import { OrgMembersTable } from "./components/OrgMembersTable";
import { OrgRoleTabSection } from "./components/OrgRoleTabSection";

enum TabSections {
  Member = "members",
  Roles = "roles"
}

export const MembersPage = withPermission(
  () => {
    const { t } = useTranslation();
    const { currentOrg } = useOrganization();

    const orgId = currentOrg?._id || "";

    const { data: roles } = useGetRoles({
      orgId
    });

    return (
      <div className="container mx-auto flex flex-col justify-between bg-bunker-800 text-white">
        <div className="mb-6 w-full py-6 px-6 max-w-7xl mx-auto">
          <p className="mr-4 mb-4 text-3xl font-semibold text-white">
            {t("section.members.org-members")}
          </p>
          <Tabs defaultValue={TabSections.Member}>
            <TabList>
              <Tab value={TabSections.Member}>Members</Tab>
              {process.env.NEXT_PUBLIC_NEW_PERMISSION_FLAG === "true" && (
                <Tab value={TabSections.Roles}>Roles</Tab>
              )}
            </TabList>
            <TabPanel value={TabSections.Member}>
              <motion.div
                key="panel-1"
                transition={{ duration: 0.15 }}
                initial={{ opacity: 0, translateX: 30 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: 30 }}
              >
                <OrgMembersTable roles={roles} />
              </motion.div>
            </TabPanel>
            <TabPanel value={TabSections.Roles}>
              <OrgRoleTabSection roles={roles} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  },
  { action: OrgGeneralPermissionActions.Read, subject: OrgPermissionSubjects.Member }
);
