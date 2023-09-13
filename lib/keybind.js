/// Key.Left などの Enum を定義
///
export const Key = Object.freeze({
    Left:    0,
    Right:   1,
    Up:      2,
    Down:    3,
    Enter:   4,
    Escape:  5,
    Skill_1: 6,
    Skill_2: 7,
    Skill_3: 8,
    Skill_4: 9,
    Skill_5: 10,
    Skill_6: 11,
    Skill_7: 12,
    Skill_8: 13,
    Skill_9: 14,
  })

/// キーバインド表
///
/// "ArrowLeft" → Key.Left のような変換をする
///
export const KeyBind = {
    "ArrowLeft":  Key.Left,
    "ArrowRight": Key.Right,
    "ArrowUp":    Key.Up,
    "ArrowDown":  Key.Down,
    "Enter":      Key.Enter,
    "Escape":     Key.Escape,
    "1":          Key.Skill_1,
    "2":          Key.Skill_2,
    "3":          Key.Skill_3,
    "4":          Key.Skill_4,
    "5":          Key.Skill_5,
    "6":          Key.Skill_6,
    "7":          Key.Skill_7,
    "8":          Key.Skill_8,
    "9":          Key.Skill_9,
  };