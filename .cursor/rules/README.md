# QuizzyFlow Cursor Rules

This directory contains Cursor Rules that help AI assistants understand and work with the QuizzyFlow codebase effectively.

## Rule Files Overview

### 1. `project-overview.mdc` (Always Applied)
**Purpose**: Provides high-level understanding of the project structure and architecture.

**Contains**:
- Project structure overview (frontend + backend)
- Complete tech stack listing
- Key conventions (paths, ports, configuration)
- Component system overview
- Redux store structure
- Build configuration and optimizations

**When to reference**: This rule is always active and gives context for any work in the project.

---

### 2. `frontend-conventions.mdc`
**Applies to**: `*.ts`, `*.tsx`, `*.jsx`, `*.js`

**Purpose**: Frontend development standards and patterns.

**Contains**:
- TypeScript guidelines and typing conventions
- React component patterns
- Redux/State management patterns
- Routing conventions
- Styling guidelines (Tailwind + Ant Design)
- API integration patterns
- Custom hooks usage
- Performance best practices

**When to reference**: When working on any React/TypeScript frontend code.

---

### 3. `backend-conventions.mdc`
**Applies to**: `server/**/*.ts`

**Purpose**: NestJS backend development standards.

**Contains**:
- NestJS module structure
- Controller and Service patterns
- DTO (Data Transfer Object) conventions
- MongoDB/Mongoose schema patterns
- JWT authentication patterns
- RESTful API design
- Error handling
- Testing conventions

**When to reference**: When working on backend API, database models, or authentication.

---

### 4. `component-development.mdc`
**Manual Reference**: Use when creating new components

**Purpose**: Step-by-step guide for creating material components.

**Contains**:
- Component directory structure
- Interface and props pattern
- Main component implementation
- Property editor creation
- Component registration process
- Component categories
- Best practices and checklist
- Testing guidelines

**When to reference**: When creating or modifying question/form components in `src/components/material/`.

---

### 5. `code-style.mdc`
**Applies to**: `*.ts`, `*.tsx`, `*.js`, `*.jsx`

**Purpose**: Code formatting and style guidelines.

**Contains**:
- TypeScript style conventions
- React component structure
- Import organization
- Formatting rules (spacing, quotes, semicolons)
- Comment guidelines
- Best practices (error handling, async/await, destructuring)
- Performance considerations

**When to reference**: For code quality, formatting, and consistency questions.

---

### 6. `common-patterns.mdc`
**Manual Reference**: Use for specific patterns and troubleshooting

**Purpose**: Common code patterns, utilities, and solutions.

**Contains**:
- Custom hooks usage examples
- Redux patterns (reading state, dispatching actions, undo/redo)
- API integration patterns
- Component data structures
- Drag and drop patterns
- Form handling
- Styling patterns
- Theme management
- Error handling
- Performance optimization
- Troubleshooting guide
- Environment variables

**When to reference**: When implementing specific features or debugging issues.

---

## How to Use These Rules

### For AI Assistants (Cursor)

The rules are automatically applied based on the `globs` and `alwaysApply` metadata:

- **Always Active**: `project-overview.mdc` provides constant context
- **File-Based**: Rules apply automatically when working on matching files
- **Manual**: Some rules (like `component-development.mdc`) can be referenced explicitly when needed

### For Developers

Even if not using Cursor, these rules serve as excellent documentation:

1. **Onboarding**: Read `project-overview.mdc` first
2. **Frontend Development**: Reference `frontend-conventions.mdc` and `code-style.mdc`
3. **Backend Development**: Reference `backend-conventions.mdc`
4. **Creating Components**: Follow `component-development.mdc` step-by-step
5. **Problem Solving**: Check `common-patterns.mdc` for solutions

## Quick Reference

### Common Tasks

| Task | Relevant Rule |
|------|---------------|
| Understanding project structure | `project-overview.mdc` |
| Creating a new React component | `frontend-conventions.mdc`, `code-style.mdc` |
| Creating a question component | `component-development.mdc` |
| Working with Redux | `frontend-conventions.mdc`, `common-patterns.mdc` |
| Creating API endpoints | `backend-conventions.mdc` |
| Styling components | `frontend-conventions.mdc`, `common-patterns.mdc` |
| Code formatting questions | `code-style.mdc` |
| Debugging issues | `common-patterns.mdc` (Troubleshooting section) |

### Key Technologies Reference

| Technology | Configuration File | Related Rule |
|------------|-------------------|--------------|
| Vite | `vite.config.ts` | `project-overview.mdc` |
| React Router | `src/router/index.tsx` | `frontend-conventions.mdc` |
| Redux Store | `src/store/index.ts` | `frontend-conventions.mdc`, `common-patterns.mdc` |
| Tailwind CSS | `tailwind.config.ts` | `frontend-conventions.mdc` |
| NestJS | `server/src/app.module.ts` | `backend-conventions.mdc` |
| TypeScript | `tsconfig.json` | `code-style.mdc` |

## Maintaining Rules

### When to Update Rules

- **New patterns emerge**: Add to `common-patterns.mdc`
- **Architecture changes**: Update `project-overview.mdc`
- **New conventions adopted**: Update relevant convention files
- **New component types**: Update `component-development.mdc`

### Rule File Format

All rules use the `.mdc` (Markdown Cursor) format with frontmatter:

```markdown
---
alwaysApply: true          # Always apply this rule
description: "..."         # Description for manual selection
globs: *.ts,*.tsx         # File patterns to apply to
---

# Rule Content

Markdown content with inline file references:
[filename.ext](mdc:filename.ext)
```

## Best Practices

1. **Start with Overview**: Always understand `project-overview.mdc` first
2. **Follow Conventions**: Stick to the patterns in convention files
3. **Reference Examples**: Use code examples in `common-patterns.mdc`
4. **Keep Updated**: Update rules when project patterns change
5. **Link Files**: Use `[file](mdc:path/to/file)` to reference actual code

## Support

For questions about:
- **Project Structure**: See `project-overview.mdc`
- **How to implement X**: See `common-patterns.mdc`
- **Code style questions**: See `code-style.mdc`
- **Specific conventions**: See relevant convention file

---

**Last Updated**: October 23, 2025  
**Project**: QuizzyFlow - Questionnaire Builder Application

