import React from "react";
import { FolderIcon, FileIcon, ChevronRight } from "lucide-react";

interface TreeNode {
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

const FileTree = () => {
  // Convert flat file list to tree structure
  const buildTree = (paths: string[]): TreeNode[] => {
    const root: TreeNode[] = [];

    paths.forEach((path) => {
      const parts = path.split("/");
      let currentLevel = root;

      parts.forEach((part, index) => {
        const isLastPart = index === parts.length - 1;
        const existingNode = currentLevel.find((node) => node.name === part);

        if (existingNode) {
          if (!isLastPart) {
            currentLevel = existingNode.children!;
          }
        } else {
          const newNode: TreeNode = {
            name: part,
            type: isLastPart ? "file" : "folder",
            ...(isLastPart ? {} : { children: [] }),
          };
          currentLevel.push(newNode);
          if (!isLastPart) {
            currentLevel = newNode.children!;
          }
        }
      });
    });

    return root;
  };

  const files = [
    "README.md",
    "Send analytics data using the Beacon API",
    "content/hello-world.md",
    "content/send-analytics-data-using-the-beacon-api-2024-12-02.md",
  ];

  const TreeItem = ({
    node,
    depth = 0,
  }: {
    node: TreeNode;
    depth?: number;
  }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
      <div className="select-none">
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer`}
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => node.type === "folder" && setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            {node.type === "folder" && (
              <ChevronRight
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
            )}
            {node.type === "folder" ? (
              <FolderIcon className="h-4 w-4 text-blue-500" />
            ) : (
              <FileIcon className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-sm truncate">{node.name}</span>
          </div>
        </div>

        {node.type === "folder" &&
          isOpen &&
          node.children?.map((child, index) => (
            <TreeItem key={index} node={child} depth={depth + 1} />
          ))}
      </div>
    );
  };

  const treeData = buildTree(files);

  return (
    <div className="w-64 bg-white border-r h-full p-2">
      <div className="font-medium text-sm mb-2 px-2">Files</div>
      {treeData.map((node, index) => (
        <TreeItem key={index} node={node} />
      ))}
    </div>
  );
};

export default FileTree;
