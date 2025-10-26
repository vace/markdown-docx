# 测试用 Markdown 文本

1. 有序列表项一 — 基本说明

   * 这是一个子无序项，包含行内代码示例：`console.log('hello')`。

   * 下面插入一个表格用于测试表格渲染：

     | 名称     | 类型     | 说明               |
     | ------ | ------ | ---------------- |
     | id     | int    | 主键，自增            |
     | name   | string | 用户姓名             |
     | active | bool   | 是否激活（true/false） |

   * 再嵌入一段多行代码（JavaScript）：

     ```javascript
     // 简单的函数示例
     function greet(name) {
       if (!name) return 'Hello, world!';
       return `Hello, ${name}!`;
     }

     console.log(greet('测试用户'));
     ```

2. 有序列表项二 — 嵌套有序与无序混合

   1. 嵌套有序子项 2.1

      * 无序子项 A
      * 无序子项 B（包含代码片段）：

        ```bash
        # 安装依赖（示例）
        npm install
        ```

   2. 嵌套有序子项 2.2（包含小表格）

      | 环境   |   版本 |
      | ---- | ---: |
      | node | 18.x |
      | npm  |  9.x |

3. 有序列表项三 — 包含引用与行内格式

   * 引用示例：

     > 这是一个引用块，用于测试在列表中嵌套引用的渲染效果。

   * 行内强调：*斜体*、**粗体**、`代码`。

   * 附加代码（Python）：

     ```python
     # 计算阶乘
     def factorial(n):
         return 1 if n <= 1 else n * factorial(n-1)

     print(factorial(5))  # 120
     ```

4. 有序列表项四 — 最后一个项，包含链接和任务列表

   * 相关链接： [示例仓库](https://example.com)
   * 任务清单（markdown task list）：

     * [x] 编写示例文档
     * [ ] 添加更多测试用例
     * [ ] 验证所有渲染器兼容性

---

* 无序列表项一

  * 子项：简单文本
  * 子项：内含表格

    | Key | Value |
    | --: | :---- |
    | foo | 123   |
    | bar | baz   |

* 无序列表项二（带代码）

  ```json
  {
    "name": "test",
    "version": "1.0.0",
    "scripts": {
      "start": "node index.js"
    }
  }
  ```

* 无序列表项三 — 结尾说明

  * 此文档用于测试 Markdown 渲染器对以下特性的支持：

    * 有序/无序列表嵌套
    * 表格在列表内部的渲染
    * 多语言代码块（JS/TS/py/bash/json）
    * 引用、行内格式与任务列表