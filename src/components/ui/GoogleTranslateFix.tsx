"use client";

import { useEffect } from "react";

/**
 * This component patches the DOM methods to prevent crashes caused by Google Translate
 * interfering with React's DOM management.
 * 
 * Google Translate sometimes modifies the DOM structure (wrapping text in <font> tags),
 * which causes React to fail when it tries to update or remove those nodes, resulting in
 * "NotFoundError: Failed to execute 'removeChild' on 'Node'".
 */
export default function GoogleTranslateFix() {
  useEffect(() => {
    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      
      // Patch removeChild to safely handle missing children
      // @ts-ignore
      Node.prototype.removeChild = function(child) {
        if (child.parentNode !== this) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              '[GoogleTranslateFix] Cannot remove a child from a different parent.', 
              child, 
              this
            );
          }
          return child;
        }
        // @ts-ignore
        return originalRemoveChild.apply(this, arguments);
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      
      // Patch insertBefore to safely handle missing reference nodes
      // @ts-ignore
      Node.prototype.insertBefore = function(newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              '[GoogleTranslateFix] Cannot insert before a reference node from a different parent.', 
              referenceNode, 
              this
            );
          }
          return newNode;
        }
        // @ts-ignore
        return originalInsertBefore.apply(this, arguments);
      };
    }
  }, []);

  return null;
}
