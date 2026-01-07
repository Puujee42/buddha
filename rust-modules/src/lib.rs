use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct LanguageContent {
    mn: String,
    en: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Monk {
    #[serde(rename = "_id")]
    id: String,
    name: LanguageContent,
    title: LanguageContent,
    video: Option<String>,
    // Add other fields if necessary, ignoring unknown fields
    #[serde(flatten)]
    extra: std::collections::HashMap<String, serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug)]
struct MonkOutput {
    id: String,
    arcana: String,
    name: LanguageContent,
    title: LanguageContent,
    video: String,
    score: u32,
}

// Simulated Arcana (Runes)
const RUNES: [&str; 8] = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ"];

#[wasm_bindgen]
pub fn process_monks(json_data: &str) -> String {
    let monks: Vec<Monk> = match serde_json::from_str(json_data) {
        Ok(m) => m,
        Err(_) => return String::from("[]"),
    };

    let mut processed: Vec<MonkOutput> = monks.iter().enumerate().map(|(i, m)| {
        // Simulated "Heavy" Calculation for compatibility/ranking
        let score = calculate_score(m);
        
        MonkOutput {
            id: m.id.clone(),
            arcana: RUNES[i % RUNES.len()].to_string(),
            name: m.name.clone(),
            title: m.title.clone(),
            video: m.video.clone().unwrap_or_else(|| "/num1.mp4".to_string()),
            score,
        }
    }).collect();

    // Sort by score descending
    processed.sort_by(|a, b| b.score.cmp(&a.score));

    // Take top 3
    let top_3: Vec<MonkOutput> = processed.into_iter().take(3).collect();

    serde_json::to_string(&top_3).unwrap_or_else(|_| String::from("[]"))
}

fn calculate_score(monk: &Monk) -> u32 {
    // Simulate complex math using name length and random factors
    let name_len = monk.name.en.len() as u32;
    // In a real app, this would be complex astrology or algo
    let seed = name_len * 7; 
    seed % 100
}
