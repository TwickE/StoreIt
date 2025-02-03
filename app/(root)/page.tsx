import Link from "next/link";
import { Models } from "node-appwrite";
import ActionsDropdown from "@/components/ActionsDropdown";
import { Chart } from "@/components/Chart";
import { FormatedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import SummaryImage from "@/components/SummaryImage";

const Dashboard = async () => {
    // Parallel requests
    const [files, totalSpace] = await Promise.all([
        getFiles({ types: [], limit: 10 }),
        getTotalSpaceUsed(),
    ]);

    // Get usage summary
    const usageSummary = getUsageSummary(totalSpace);

    return (
        <div className="dashboard-container">
            <section>
                <Chart used={totalSpace.used} />

                {/* Uploaded file type summaries */}
                <ul className="dashboard-summary-list">
                    {usageSummary.map((summary) => (
                        <Link
                            href={summary.url}
                            key={summary.title}
                            className="dashboard-summary-card"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between gap-3">
                                    <SummaryImage summary={summary} />
                                    <h4 className="summary-type-size">
                                        {convertFileSize(summary.size) || 0}
                                    </h4>
                                </div>

                                <h5 className="summary-type-title">{summary.title}</h5>
                                <Separator className="!bg-light-400 dark:!bg-slate-600" />
                                <FormatedDateTime
                                    date={summary.latestDate}
                                    className="text-center"
                                />
                            </div>
                        </Link>
                    ))}
                </ul>
            </section>

            {/* Recent files uploaded */}
            <section className="dashboard-recent-files">
                <h2 className="h3 xl:h2 text-light-100 dark:text-light-400">Recent Files Uploaded</h2>
                {files.documents.length > 0 ? (
                    <ul className="mt-5 flex flex-col gap-5">
                        {files.documents.map((file: Models.Document) => (
                            <Link
                                href={file.url}
                                target="_blank"
                                className="flex items-center gap-3"
                                key={file.$id}
                            >
                                <Thumbnail
                                    type={file.type}
                                    extension={file.extension}
                                    url={file.url}
                                />

                                <div className="recent-file-details">
                                    <div className="flex flex-col gap-1">
                                        <p className="recent-file-name">{file.name}</p>
                                        <FormatedDateTime
                                            date={file.$createdAt}
                                            className="caption"
                                        />
                                    </div>
                                    <ActionsDropdown file={file} />
                                </div>
                            </Link>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-list">No files uploaded</p>
                )}
            </section>
        </div>
    );
};

export default Dashboard;