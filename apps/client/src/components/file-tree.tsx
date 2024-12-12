import React from "react";
import { FolderIcon, FileIcon, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
type TreeNode<T extends "file" | "folder" = "file" | "folder"> = {
  name: string;
  type: T;
  path: string;
  children?: T extends "file" ? never : TreeNode<T>[];
};

interface FileTreeProps {
  files: string[];
  filters?: string[];
}

export const FileTree = ({ files, filters }: FileTreeProps) => {
  // Convert flat file list to tree structure
  const buildTree = (paths: string[]): TreeNode[] => {
    const root: TreeNode[] = [];

    // Filter paths if filters are provided
    const filteredPaths = filters
      ? paths.filter(
          (path) =>
            filters.some((filter) => path.endsWith(filter)) ||
            // Include paths that have children matching the filter
            paths.some(
              (otherPath) =>
                otherPath.startsWith(path + "/") &&
                filters.some((filter) => otherPath.endsWith(filter))
            )
        )
      : paths;

    filteredPaths.forEach((path) => {
      const parts = path.split("/");
      let currentLevel = root;
      let currentPath = "";

      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isLastPart = index === parts.length - 1;
        const existingNode = currentLevel.find((node) => node.name === part);

        if (existingNode) {
          if (!isLastPart) {
            currentLevel = existingNode.children!;
          }
        } else {
          const newNode: TreeNode = {
            name: part,
            path: currentPath,
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

    // Remove empty folders
    const removeEmptyFolders = (
      nodes: TreeNode<"folder">[]
    ): TreeNode<"folder">[] => {
      return nodes.filter((node) => {
        if (node.type === "folder" && node.children) {
          node.children = removeEmptyFolders(node.children!);
          return node.children.length > 0;
        }
        return true;
      });
    };

    return removeEmptyFolders(root as TreeNode<"folder">[]);
  };

  const TreeItem = ({
    node,
    depth = 0,
  }: {
    node: TreeNode;
    depth?: number;
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="select-none">
        {node.type === "folder" ? (
          <button
            className={`flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer`}
            style={{ paddingLeft: `${depth * 16}px` }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <ChevronRight
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
              <span className="text-sm truncate">{node.name}</span>
            </div>
          </button>
        ) : (
          <Link
            to={`/$path`}
            params={{ path: node.path }}
            className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer`}
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            <div className="flex items-center gap-2">
              <FileIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm truncate">{node.name}</span>
            </div>
          </Link>
        )}

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
    <div className="flex flex-col h-full w-64 ">
      <div className="font-medium text-sm mb-2 px-2">Files</div>
      <div className="w-64 bg-white border-r max-w-64 overflow-x-auto max-h-[calc(100vh-100px)] px-2">
        {treeData.map((node, index) => (
          <TreeItem key={index} node={node} />
        ))}
      </div>
    </div>
  );
};
