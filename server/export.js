// server/export.js
// Generates professional 5-sheet .xlsx workbook using exceljs
import ExcelJS from 'exceljs';
import { DB } from './db.js';

export async function generateLeaderboardWorkbook() {
  const { overall, bySection, summary } = DB.getLeaderboardData(true); // true = include contact numbers for organizers

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Finding Nemo — Find the Data Event Organizers';
  workbook.lastModifiedBy = 'Dexterity Technical Event System';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Color Palette
  const NAVY_HEADER_FILL = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF072A4A' } // Deep Ocean Navy
  };
  const HEADER_FONT = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };
  const DATA_FONT = {
    name: 'Segoe UI',
    size: 10
  };
  const GOLD_FILL = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFF3CD' } // Soft Gold
  };
  const SILVER_FILL = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2E3E5' } // Soft Silver
  };
  const BRONZE_FILL = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8D7DA' } // Soft Bronze/Coral
  };
  const THIN_BORDER = {
    top: { style: 'thin', color: { argb: 'FFD0D7DE' } },
    left: { style: 'thin', color: { argb: 'FFD0D7DE' } },
    bottom: { style: 'thin', color: { argb: 'FFD0D7DE' } },
    right: { style: 'thin', color: { argb: 'FFD0D7DE' } }
  };

  const columns = [
    { header: 'Rank', key: 'rank', width: 8, alignment: { horizontal: 'center' } },
    { header: 'Team ID', key: 'teamId', width: 14, alignment: { horizontal: 'center' } },
    { header: 'Team Name', key: 'teamName', width: 26, alignment: { horizontal: 'left' } },
    { header: 'Team Leader', key: 'leaderName', width: 22, alignment: { horizontal: 'left' } },
    { header: 'Contact Number', key: 'contactNumber', width: 18, alignment: { horizontal: 'center' } },
    { header: 'Selected Section', key: 'section', width: 18, alignment: { horizontal: 'center' } },
    { header: 'Completed (15)', key: 'completedQuestions', width: 16, alignment: { horizontal: 'center' } },
    { header: 'Main Score (150)', key: 'mainScore', width: 16, alignment: { horizontal: 'center' } },
    { header: 'Shark Bonus', key: 'bonusPoints', width: 14, alignment: { horizontal: 'center' } },
    { header: 'Final Score', key: 'finalScore', width: 14, alignment: { horizontal: 'center' } },
    { header: 'Status', key: 'status', width: 16, alignment: { horizontal: 'center' } }
  ];

  function populateLeaderboardSheet(sheet, rows, titleText) {
    sheet.columns = columns.map(c => ({
      header: c.header,
      key: c.key,
      width: c.width
    }));

    // Header styling
    const headerRow = sheet.getRow(1);
    headerRow.height = 26;
    headerRow.eachCell((cell, colNum) => {
      cell.fill = NAVY_HEADER_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { vertical: 'middle', horizontal: columns[colNum - 1].alignment.horizontal };
      cell.border = THIN_BORDER;
    });

    // Freeze header
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    // Add rows
    rows.forEach((row, idx) => {
      const addedRow = sheet.addRow({
        rank: row.rank,
        teamId: row.teamId,
        teamName: row.teamName,
        leaderName: row.leaderName,
        contactNumber: row.contactNumber || '—',
        section: row.section,
        completedQuestions: `${row.completedQuestions} / 15`,
        mainScore: row.mainScore,
        bonusPoints: `+${row.bonusPoints}`,
        finalScore: row.finalScore,
        status: row.status
      });

      addedRow.height = 22;
      addedRow.eachCell((cell, colNum) => {
        cell.font = DATA_FONT;
        cell.alignment = { vertical: 'middle', horizontal: columns[colNum - 1].alignment.horizontal };
        cell.border = THIN_BORDER;

        // Highlight top 3 teams
        if (row.rank === 1) {
          cell.fill = GOLD_FILL;
          cell.font = { ...DATA_FONT, bold: true };
        } else if (row.rank === 2) {
          cell.fill = SILVER_FILL;
          cell.font = { ...DATA_FONT, bold: true };
        } else if (row.rank === 3) {
          cell.fill = BRONZE_FILL;
          cell.font = { ...DATA_FONT, bold: true };
        } else if (idx % 2 === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' }
          };
        }
      });
    });

    // Auto-filter
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: rows.length > 0 ? rows.length + 1 : 1, column: columns.length }
    };
  }

  // Sheet 1: Overall Leaderboard
  const sheetOverall = workbook.addWorksheet('Overall Leaderboard');
  populateLeaderboardSheet(sheetOverall, overall, 'Overall Leaderboard');

  // Sheet 2: Excel Section
  const sheetExcel = workbook.addWorksheet('Excel Section');
  populateLeaderboardSheet(sheetExcel, bySection.excel, 'Dory\'s Spreadsheet Challenge (Excel)');

  // Sheet 3: Python Section
  const sheetPython = workbook.addWorksheet('Python Section');
  populateLeaderboardSheet(sheetPython, bySection.python, 'Crush\'s Code Quest (Python)');

  // Sheet 4: SQL Section
  const sheetSQL = workbook.addWorksheet('SQL Section');
  populateLeaderboardSheet(sheetSQL, bySection.sql, 'The Sunken Database (SQL)');

  // Sheet 5: Event Summary
  const sheetSummary = workbook.addWorksheet('Event Summary');
  sheetSummary.columns = [
    { header: 'Event Metric', key: 'metric', width: 34 },
    { header: 'Value', key: 'value', width: 22 }
  ];

  const summaryHeader = sheetSummary.getRow(1);
  summaryHeader.height = 26;
  summaryHeader.eachCell(cell => {
    cell.fill = NAVY_HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    cell.border = THIN_BORDER;
  });

  const summaryData = [
    { metric: 'Total Registered Teams', value: summary.totalTeams },
    { metric: 'Teams in Excel Section', value: summary.excelCount },
    { metric: 'Teams in Python Section', value: summary.pythonCount },
    { metric: 'Teams in SQL Section', value: summary.sqlCount },
    { metric: 'Teams Unassigned / In Registration', value: summary.unassignedCount },
    { metric: 'Teams Completed (15/15)', value: summary.completedTeams },
    { metric: 'Teams In Progress', value: summary.inProgressTeams },
    { metric: 'Highest Final Score Achieved', value: summary.highestScore },
    { metric: 'Average Final Score', value: summary.averageScore },
    { metric: 'Shark Attack Participants', value: summary.sharkAttackParticipants },
    { metric: 'Total Bonus Points Awarded', value: summary.totalBonusAwarded },
    { metric: 'Report Generated At', value: new Date().toLocaleString() }
  ];

  summaryData.forEach((item, idx) => {
    const row = sheetSummary.addRow({
      metric: item.metric,
      value: item.value
    });
    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.font = DATA_FONT;
      cell.border = THIN_BORDER;
      cell.alignment = { vertical: 'middle', horizontal: colNum === 1 ? 'left' : 'center' };
      if (idx % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9FAFB' }
        };
      }
    });
  });

  sheetSummary.views = [{ state: 'frozen', ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
